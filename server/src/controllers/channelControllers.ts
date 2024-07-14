import { Request, Response } from "express";
import { ERROR_CODES } from "../constants/errorCode";
import { getNamespace } from "../sockets";
import { SOCKET_EVENTS, SOCKET_NAMESPACES } from "../constants/socket";
import { delay } from "../utils/delay";
import db from "../config/db";

export const createChannel = async (req: Request, res: Response) => {
  const { name, serverId } = req.body;
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
      },
    });

    const serverNameSpace = getNamespace(SOCKET_NAMESPACES.SERVER);
    serverNameSpace.emit(SOCKET_EVENTS.SERVER.ADD_CHANNEL, { channel });

    res.status(201).json(channel);
  } catch (error) {
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

  const nextCursor =
    messages.length === Number(limit) ? messages[messages.length - 1].id : null;

  res.json({
    messages,
    nextCursor,
  });
};

export const createMessage = async (req: Request, res: Response) => {
  const { channelId } = req.params;
  const { content, tempId } = req.body;
  const { id: authorId } = req.user;

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

    // for test purpose.
    // await delay(1000);
    // throw new Error("Failed to create message");

    const channelsNamespace = getNamespace(SOCKET_NAMESPACES.CHANNEL);
    channelsNamespace
      .to(channelId)
      .emit(SOCKET_EVENTS.CHANNEL.NEW_MESSAGE, { ...newMessage, tempId });

    res.json(newMessage);
  } catch (error) {
    res.status(500).json({ error: "Failed to create message" });
  }
};
