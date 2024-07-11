import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { ERROR_CODES } from "../constants/errorCode";

const prisma = new PrismaClient();

export const createChannel = async (req: Request, res: Response) => {
  const { name, serverId } = req.body;
  const userId = req.user.id;

  try {
    const server = await prisma.server.findUnique({
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

    const channel = await prisma.channel.create({
      data: {
        name,
        serverId,
        ownerId: userId,
      },
    });

    res.status(201).json(channel);
  } catch (error) {
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
    const channel = await prisma.channel.findUnique({
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

    await prisma.channel.delete({
      where: { id: parseInt(id) },
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

  const messages = await prisma.message.findMany({
    where: { channelId: Number(channelId) },
    take: Number(limit),
    skip: cursor ? 1 : 0, // cursor가 있다면 1개를 건너뜀
    cursor: cursor ? { id: Number(cursor) } : undefined,
    orderBy: { createdAt: "desc" },
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
  const { content, authorId } = req.body;

  try {
    const newMessage = await prisma.message.create({
      data: {
        content,
        channelId: Number(channelId),
        authorId: Number(authorId),
      },
    });
    res.json(newMessage);
  } catch (error) {
    res.status(500).json({ error: "Failed to create message" });
  }
};
