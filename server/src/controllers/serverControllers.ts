import { Request, Response } from "express";
import prisma from "../config/db";
import { ERROR_CODES } from "../constants/errorCode";

export const createServer = async (req: Request, res: Response) => {
  const { name } = req.body;
  const userId = req.user.id;

  try {
    const server = await prisma.server.create({
      data: {
        name,
        ownerId: userId,
        channels: {
          create: {
            name: "일반",
            ownerId: userId,
            protected: true,
          },
        },
      },
      include: {
        channels: true,
      },
    });
    res.status(201).json(server);
  } catch (error) {
    res.status(500).json({
      errorCode: ERROR_CODES.INTERNAL_SERVER_ERROR,
      message: "Internal Server Error",
    });
  }
};

export const deleteServer = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const server = await prisma.server.findUnique({
      where: { id: parseInt(id) },
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

    await prisma.server.delete({
      where: { id: parseInt(id) },
    });

    res.status(204).send();
  } catch (error) {
    console.log(error);

    res.status(500).json({
      errorCode: ERROR_CODES.INTERNAL_SERVER_ERROR,
      message: "Internal Server Error",
    });
  }
};

export const getUserServersWithChannels = async (
  req: Request,
  res: Response
) => {
  const userId = req.user.id;

  try {
    const servers = await prisma.server.findMany({
      where: {
        OR: [{ ownerId: userId }, { members: { some: { id: userId } } }],
      },
      include: {
        channels: true,
      },
    });

    res.status(200).json(servers);
  } catch (error) {
    res.status(500).json({
      errorCode: ERROR_CODES.INTERNAL_SERVER_ERROR,
      message: "Internal Server Error",
    });
  }
};
