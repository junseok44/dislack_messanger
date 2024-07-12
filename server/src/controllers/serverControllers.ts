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
    console.log(error);

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

export const joinServer = async (req: Request, res: Response) => {
  const { inviteCode } = req.body;
  const { id: userId } = req.user;

  try {
    const server = await prisma.server.findUnique({
      where: { inviteCode },
      include: {
        members: true,
      },
    });

    if (!server) {
      return res.status(404).json({
        message: "Server not found",
        errorCode: ERROR_CODES.SERVER_NOT_FOUND,
      });
    }

    const isMember = server.members.some((member) => member.id === userId);

    if (isMember) {
      return res.status(400).json({
        message: "User is already a member of this server",
        errorCode: ERROR_CODES.USER_ALREADY_MEMBER,
      });
    }

    const newServer = await prisma.server.update({
      where: { id: server.id },
      data: {
        members: {
          connect: { id: userId },
        },
      },
      include: {
        channels: true,
      },
    });

    res.json(newServer);
  } catch (error) {
    console.error("Failed to join server:", error);
    res.status(500).json({
      message: "Failed to join server",
      errorCode: ERROR_CODES.INTERNAL_SERVER_ERROR,
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
    console.log(error);

    res.status(500).json({
      errorCode: ERROR_CODES.INTERNAL_SERVER_ERROR,
      message: "Internal Server Error",
    });
  }
};
