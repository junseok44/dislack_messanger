const tokenConfig = {
  jwtSecret: process.env.JWT_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  jwtExpiration: "15m",
  jwtRefreshExpiration: "7d",
};

interface TokenCookieOption {
  httpOnly: boolean;
  secure: boolean;
  sameSite: "strict" | "none";
  maxAge: number;
}

const accessTokenOption: TokenCookieOption = {
  httpOnly: process.env.NODE_ENV === "production",
  secure: true,
  sameSite: process.env.NODE_ENV === "production" ? "strict" : "none",
  maxAge: 15 * 60 * 1000, // 15분
};

const refreshTokenOption: TokenCookieOption = {
  httpOnly: process.env.NODE_ENV === "production",
  secure: true,
  sameSite: process.env.NODE_ENV === "production" ? "strict" : "none",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
};

export const getTokenCookieOption = (type: "accessToken" | "refreshToken") => {
  return type === "accessToken" ? accessTokenOption : refreshTokenOption;
};

export default tokenConfig;
