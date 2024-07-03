import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import tokenConfig from "../config/token";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, tokenConfig.jwtSecret, (err, user) => {
    if (err) return res.sendStatus(403);

    req.user = user;
    next();
  });
};
