export const SOCKET_EVENTS = {
  CONNECTION: "connection" as const,
  DISCONNECT: "disconnect" as const,
  JOIN_CHANNEL: "joinChannel" as const,
  LEAVE_CHANNEL: "leaveChannel" as const,
  NEW_MESSAGE: "newMessage" as const,
  SOME_EVENT: "someEvent" as const,
};

export const SOCKET_NAMESPACES = {
  CHANNELS: "/channels" as const,
};
