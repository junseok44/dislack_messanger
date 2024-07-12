import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/db";
import tokenConfig, { getTokenCookieOption } from "../config/token";
import { generateAccessToken, generateRefreshToken } from "../utils/token";
import { z } from "zod";
import { ERROR_CODES } from "../constants/errorCode";

const userSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(8).max(100),
});

export const register = async (req: Request, res: Response) => {
  try {
    userSchema.parse(req.body);

    const { username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: { username, password: hashedPassword },
    });
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.log(error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        errorCode: ERROR_CODES.INVALID_FORM,
        message: "Invalid request",
        details: error.errors,
      });
    }

    res.status(500).json({
      errorCode: ERROR_CODES.INTERNAL_SERVER_ERROR,
      message: "Internal Server Error",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    userSchema.parse(req.body);

    const { username, password } = req.body;

    const user = await prisma.user.findUnique({ where: { username } });

    if (!user)
      return res.status(400).json({
        errorCode: ERROR_CODES.USER_NOT_FOUND,
        message: "User doesn't exist",
      });

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword)
      return res.status(400).json({
        errorCode: ERROR_CODES.INVALID_PASSWORD,
        message: "Invalid password",
      });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("accessToken", accessToken, {
      ...getTokenCookieOption("accessToken"),
    });

    res.cookie("refreshToken", refreshToken, {
      ...getTokenCookieOption("refreshToken"),
    });

    res.json({
      message: "Logged in successfully",
      user: {
        username: user.username,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        errorCode: ERROR_CODES.INVALID_FORM,
        message: "Invalid request",
        details: error.errors,
      });
    }

    console.log(error);

    res.status(500).json({
      errorCode: ERROR_CODES.INTERNAL_SERVER_ERROR,
      message: "Internal Server Error",
    });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken)
    return res.sendStatus(401).json({
      errorCode: ERROR_CODES.UNAUTHORIZED,
      message: "No refresh token provided",
    });

  try {
    const decoded = jwt.verify(
      refreshToken,
      tokenConfig.jwtRefreshSecret!
    ) as jwt.JwtPayload;

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user)
      return res.status(403).json({
        errorCode: ERROR_CODES.FORBIDDEN,
        message: "User not found",
      });

    const newAccessToken = generateAccessToken(user);

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15분
    });

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(403).json({
      errorCode: ERROR_CODES.INVALID_REFRESH_TOKEN,
      message: "Invalid Refresh Token",
    });
  }
};

export const checkAuth = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(403).json({
      errorCode: ERROR_CODES.FORBIDDEN,
      message: "Invalid access token",
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        username: true,
      },
    });

    if (!user)
      return res.status(403).json({
        errorCode: ERROR_CODES.FORBIDDEN,
        message: "Invalid access token",
      });

    res.json({ isAuthenticated: true, user });
  } catch (error) {
    res.status(403).json({
      errorCode: ERROR_CODES.FORBIDDEN,
      message: "Invalid access token",
    });
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

  res.json({ message: "Logged out successfully" });
};
