export const ROUTES = {
  SERVER: {
    CREATE: "/",
    DELETE: "/:id",
    GET_USER_SERVERS_WITH_CHANNELS: "/user",
  },
  CHANNEL: {
    CREATE: "/",
    DELETE: "/:id",
  },
  AUTH: {
    REGISTER: "/register",
    LOGIN: "/login",
    CHECK_AUTH: "/check",
    REFRESH_TOKEN: "/refresh-token",
    LOGOUT: "/logout",
  },
};
