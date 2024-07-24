import { Request, Response } from "express";
import { ERROR_CODES } from "../constants/errorCode";
import { getNamespace } from "../sockets";
import { SOCKET_EVENTS, SOCKET_NAMESPACES } from "../constants/socket";
import { delay } from "../utils/delay";
import db from "../config/db";
import { z } from "zod";

const createChannelSchema = z.object({
  name: z.string().min(1),
  serverId: z.number().int(),
  type: z.enum(["TEXT", "VOICE"]).optional().default("TEXT"),
});

export const createChannel = async (req: Request, res: Response) => {
  const { name, serverId, type } = createChannelSchema.parse(req.body);
  const userId = req.user.id;

  try {
    const server = await db.server.findUnique({
      where: { id: serverId },
    });

    if (!server) {
      return res.status(404).json({
        errorCode: ERROR_CODES.SERVER_NOT_FOUND,
        message: "Server not found",
      });
    }

    if (server.ownerId !== userId) {
      return res.status(403).json({
        errorCode: ERROR_CODES.FORBIDDEN,
        message: "Invalid access token",
      });
    }

    const channel = await db.channel.create({
      data: {
        name,
        serverId,
        ownerId: userId,
        ...(type && { type }),
      },
    });

    const serverNameSpace = getNamespace(SOCKET_NAMESPACES.SERVER);
    serverNameSpace.emit(SOCKET_EVENTS.SERVER.ADD_CHANNEL, { channel });

    res.status(201).json(channel);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        errorCode: ERROR_CODES.INVALID_REQUEST,
        message: error.errors,
      });
    }

    console.log(error);

    res.status(500).json({
      errorCode: ERROR_CODES.INTERNAL_SERVER_ERROR,
      message: "Internal Server Error",
    });
  }
};

export const deleteChannel = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const channel = await db.channel.findUnique({
      where: { id: parseInt(id) },
    });

    if (!channel) {
      return res.status(404).json({
        errorCode: ERROR_CODES.CHANNEL_NOT_FOUND,
        message: "Channel not found",
      });
    }

    if (channel.ownerId !== userId) {
      return res.status(403).json({
        errorCode: ERROR_CODES.FORBIDDEN,
        message: "Invalid access token",
      });
    }

    if (channel.protected) {
      return res.status(403).json({
        errorCode: ERROR_CODES.DEFAULT_CANNOT_BE_DELETED,
        message: "Default channel cannot be deleted",
      });
    }

    await db.channel.delete({
      where: { id: parseInt(id) },
    });

    const serverNameSpace = getNamespace(SOCKET_NAMESPACES.SERVER);
    serverNameSpace.emit(SOCKET_EVENTS.SERVER.DELETE_CHANNEL, {
      serverId: channel.serverId,
      channelId: channel.id,
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      errorCode: ERROR_CODES.INTERNAL_SERVER_ERROR,
      message: "Internal Server Error",
    });
  }
};

export const getChannelMessages = async (req: Request, res: Response) => {
  const { channelId } = req.params;
  const { cursor, limit = 20 } = req.query;

  try {
    const messages = await db.message.findMany({
      where: { channelId: Number(channelId) },
      take: Number(limit),
      skip: cursor ? 1 : 0, // cursor가 있다면 1개를 건너뜀
      cursor: cursor ? { id: Number(cursor) } : undefined,
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    await delay(1000);

    const nextCursor =
      messages.length === Number(limit)
        ? messages[messages.length - 1].id
        : null;

    res.json({
      messages,
      nextCursor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to get messages",
      errorCode: ERROR_CODES.INTERNAL_SERVER_ERROR,
    });
  }
};

export const createMessage = async (req: Request, res: Response) => {
  const { channelId } = req.params;
  const { content, tempId, serverId } = req.body;
  const { id: authorId } = req.user;

  if (!content || !channelId || !authorId || !serverId) {
    return res.status(400).json({
      error: "Invalid request",
      errorCode: ERROR_CODES.INVALID_REQUEST,
    });
  }

  try {
    const newMessage = await db.message.create({
      data: {
        content,
        channelId: Number(channelId),
        authorId: Number(authorId),
      },
      include: {
        author: true,
      },
    });

    await db.channel.update({
      where: { id: Number(channelId) },
      data: {
        lastMessageId: {
          set: newMessage.id,
        },
      },
    });

    // for test purpose.
    // await delay(1000);
    // throw new Error("Failed to create message");

    const channelsNamespace = getNamespace(SOCKET_NAMESPACES.CHANNEL);
    channelsNamespace
      .to(channelId)
      .emit(SOCKET_EVENTS.CHANNEL.NEW_MESSAGE, { ...newMessage, tempId });

    const serverNameSpace = getNamespace(SOCKET_NAMESPACES.SERVER);
    serverNameSpace.emit(SOCKET_EVENTS.SERVER.CHANNEL_UPDATE_LAST_MESSAGE_ID, {
      channelId: Number(channelId),
      lastMessageId: newMessage.id,
      serverId,
      authorId,
    });

    res.json(newMessage);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Failed to create message",
      errorCode: ERROR_CODES.INTERNAL_SERVER_ERROR,
    });
  }
};

export const updateLastSeenMessage = async (req: Request, res: Response) => {
  const { channelId } = req.params;
  const { id: userId } = req.user;

  try {
    const channel = await db.channel.findUnique({
      where: { id: parseInt(channelId) },
      select: { lastMessageId: true },
    });

    if (!channel) {
      return res.status(404).json({
        message: "Channel not found",
        errorCode: ERROR_CODES.CHANNEL_NOT_FOUND,
      });
    }

    await db.lastSeenMessageOnChannel.upsert({
      where: {
        unique_user_channel: {
          userId: userId,
          channelId: parseInt(channelId),
        },
      },
      update: { messageId: channel.lastMessageId },
      create: {
        channelId: parseInt(channelId),
        messageId: channel.lastMessageId,
        userId,
      },
    });

    res.status(200).json({
      message: "Last seen message updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
