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
