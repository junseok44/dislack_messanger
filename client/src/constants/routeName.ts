export const PAGE_ROUTE = {
  HOME: "/",
  REGISTER: "/register",
  LOGIN: "/login",
  // CHANNELS_ME: "/channels/@me",
  ONBOARDING: "/onboarding",
  CHANNELS: "/channels/:serverId/:channelId",
  NOT_FOUND: "/not-found",
  ERROR: "/error",
  CHECKOUT: "/subscription/checkout",
  PRODUCTS: "/products",
  ALL: "*",
  GOTO_CHANNEL: (serverId: number, channelId: number) =>
    `/channels/${serverId}/${channelId}`,
};

export const API_ROUTE = {
  SUBSCRIPTION: {
    CHECKOUT_SESSION: "/subscription/checkout-session",
    CHECKOUT_SESSION_COMPLETE: (sessionId: string | number) =>
      `/subscription/checkout-session/${sessionId}`,
  },
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
    JOIN: "/server/join",
  },
  CHANNEL: {
    CREATE: "/channels",
    DELETE: (id: number | string) => `/channels/${id}`,
  },
  MESSAGES: {
    GET: (channelId: number | string) => `/channels/${channelId}/messages`,
    POST: (channelId: number | string) => `/channels/${channelId}/messages`,
    UPDATE_LAST_SEEN_MESSAGE: (channelId: number | string) =>
      `/channels/${channelId}/last-seen-message`,
  },
};
