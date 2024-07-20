import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/db";
import tokenConfig, { getTokenCookieOption } from "../config/token";
import { generateAccessToken, generateRefreshToken } from "../utils/token";
import { z } from "zod";
import { ERROR_CODES } from "../constants/errorCode";
import {
  formatErrorResponse,
  formatSuccessResponse,
} from "../utils/formatResponse";

const userSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(8).max(100),
});

export const register = async (req: Request, res: Response) => {
  try {
    userSchema.parse(req.body);

    const { username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await prisma.user.findUnique({ where: { username } });

    if (existingUser) {
      return res
        .status(400)
        .json(
          formatErrorResponse(
            ERROR_CODES.USER_ALREADY_EXISTS,
            "User already exists"
          )
        );
    }

    await prisma.user.create({
      data: { username, password: hashedPassword },
    });

    res.status(201).json(formatSuccessResponse("User registered successfully"));
  } catch (error) {
    console.log(error);

    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json(formatErrorResponse(ERROR_CODES.INVALID_FORM, "Invalid request"));
    }

    res
      .status(500)
      .json(
        formatErrorResponse(
          ERROR_CODES.INTERNAL_SERVER_ERROR,
          "Internal Server Error"
        )
      );
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    userSchema.parse(req.body);

    const { username, password } = req.body;

    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
      return res
        .status(400)
        .json(
          formatErrorResponse(ERROR_CODES.USER_NOT_FOUND, "User doesn't exist")
        );
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res
        .status(400)
        .json(
          formatErrorResponse(ERROR_CODES.INVALID_PASSWORD, "Invalid password")
        );
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("accessToken", accessToken, {
      ...getTokenCookieOption("accessToken"),
    });

    res.cookie("refreshToken", refreshToken, {
      ...getTokenCookieOption("refreshToken"),
    });

    res.json(
      formatSuccessResponse("Logged in successfully", {
        user: {
          username: user.username,
          id: user.id,
          planId: user.planId,
        },
      })
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json(formatErrorResponse(ERROR_CODES.INVALID_FORM, "Invalid request"));
    }

    console.log(error);

    res
      .status(500)
      .json(
        formatErrorResponse(
          ERROR_CODES.INTERNAL_SERVER_ERROR,
          "Internal Server Error"
        )
      );
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res
      .status(401)
      .json(
        formatErrorResponse(
          ERROR_CODES.UNAUTHORIZED,
          "No refresh token provided"
        )
      );
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      tokenConfig.jwtRefreshSecret!
    ) as jwt.JwtPayload;

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) {
      return res
        .status(403)
        .json(formatErrorResponse(ERROR_CODES.FORBIDDEN, "User not found"));
    }

    const newAccessToken = generateAccessToken(user);

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15분
    });

    res.json(
      formatSuccessResponse("New access token generated", {
        accessToken: newAccessToken,
      })
    );
  } catch (error) {
    res
      .status(403)
      .json(
        formatErrorResponse(
          ERROR_CODES.INVALID_REFRESH_TOKEN,
          "Invalid Refresh Token"
        )
      );
  }
};

export const checkAuth = async (req: Request, res: Response) => {
  if (!req.user) {
    return res
      .status(403)
      .json(formatErrorResponse(ERROR_CODES.FORBIDDEN, "Invalid access token"));
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        username: true,
        id: true,
        planId: true,
      },
    });

    if (!user) {
      return res
        .status(403)
        .json(
          formatErrorResponse(ERROR_CODES.FORBIDDEN, "Invalid access token")
        );
    }

    res.json(
      formatSuccessResponse("Authenticated successfully", {
        isAuthenticated: true,
        user,
      })
    );
  } catch (error) {
    res
      .status(403)
      .json(formatErrorResponse(ERROR_CODES.FORBIDDEN, "Invalid access token"));
  }
};

export const logout = (req: Request, res: Response) => {
  res.cookie("accessToken", "", {
    ...getTokenCookieOption("accessToken"),
    expires: new Date(0),
  });

  res.cookie("refreshToken", "", {
    ...getTokenCookieOption("refreshToken"),
    expires: new Date(0),
  });

  res.json(formatSuccessResponse("Logged out successfully"));
};
