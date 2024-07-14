export const SOCKET_EVENTS = {
  CHANNEL: {
    CONNECTION: "connection" as const,
    DISCONNECT: "messages_disconnect" as const,
    JOIN_CHANNEL: "messages_joinChannel" as const,
    LEAVE_CHANNEL: "messages_leaveChannel" as const,
    NEW_MESSAGE: "messages_newMessage" as const,
  },
  SERVER: {
    CONNECTION: "connection" as const,
    DISCONNECT: "disconnect" as const,
    SUBSCRIBE_SERVER: "server_subscribeServer" as const,
    UNSUBSCRIBE_SERVER: "server_unsubscribeServer" as const,
    ADD_CHANNEL: "server_addChannel" as const,
    DELETE_CHANNEL: "server_deleteChannel" as const,
    DELETE_SERVER: "server_deleteServer" as const,
    CHANNEL_UPDATE_LAST_MESSAGE_ID:
      "server_channelUpdateLastMessageId" as const,
    CHANNEL_UPDATE_PARTICIPANTS: "channels_updateChannelParticipants" as const,
  },
};

export const SOCKET_NAMESPACES = {
  CHANNEL: "/channel" as const,
  SERVER: "/server" as const,
};
