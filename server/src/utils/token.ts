import jwt from "jsonwebtoken";
import config from "../config/token";

export const generateAccessToken = (user: { id: number }) => {
  return jwt.sign({ id: user.id }, config.jwtSecret, {
    expiresIn: config.jwtExpiration,
  });
};

export const generateRefreshToken = (user: { id: number }) => {
  return jwt.sign({ id: user.id }, config.jwtRefreshSecret, {
    expiresIn: config.jwtRefreshExpiration,
  });
};
