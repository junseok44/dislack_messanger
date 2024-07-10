export const PAGE_ROUTE = {
  HOME: "/",
  REGISTER: "/register",
  LOGIN: "/login",
  CHANNELS_ME: "/channels/@me",
  CHANNELS_FRIENDS: "/channels/@me/:userId",
  CHANNELS: "/channels/:serverId/:channelId",
  NOT_FOUND: "/not-found",
  ERROR: "/error",
  ALL: "*",

  GOTO_CHANNEL: (serverId: number, channelId: number) =>
    `/channels/${serverId}/${channelId}`,
  GOTO_FRIENDS_PAGE: (userId: number) => `/channels/@me/${userId}`,
};

export const API_ROUTE = {
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    CHECK: "/auth/check",
    REFRESH_TOKEN: "/auth/refresh-token",
    LOGOUT: "/auth/logout",
  },
  SERVER: {
    CREATE: "/server/",
    DELETE: (id: number | string) => `/server/${id}`,
    GET_USER_SERVERS_WITH_CHANNELS: "/server/user",
  },
  CHANNEL: {
    CREATE: "/channel/",
    DELETE: (id: number | string) => `/channel/${id}`,
  },
};
