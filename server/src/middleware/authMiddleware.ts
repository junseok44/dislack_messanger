import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import tokenConfig, { getTokenCookieOption } from "../config/token";
import { generateAccessToken } from "../utils/token";
import { ERROR_CODES } from "../constants/errorCode";

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res
      .status(401)
      .json({ message: "Unauthorized", errorCode: ERROR_CODES.UNAUTHORIZED });
  }

  jwt.verify(token, tokenConfig.jwtSecret!, (err, data) => {
    if (err || !data.id) {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        return res.status(401).json({
          message: "Unauthorized",
          errorCode: ERROR_CODES.UNAUTHORIZED,
        });
      }

      jwt.verify(refreshToken, tokenConfig.jwtRefreshSecret!, (err, data) => {
        if (err || !data.id) {
          return res.status(401).json({
            message: "Unauthorized",
            errorCode: ERROR_CODES.UNAUTHORIZED,
          });
        }

        // console.log(
        //   "middleware/auth.ts: 리프레시 토큰으로 새로운 액세스 토큰을 발급합니다."
        // );

        const newAccessToken = generateAccessToken(data);

        res.cookie("accessToken", newAccessToken, {
          ...getTokenCookieOption("accessToken"),
        });

        req.user = data;
        next();
      });
    } else {
      // console.log("middleware/auth.ts: 액세스 토큰이 유효합니다.");
      req.user = data;
      next();
    }
  });
};
