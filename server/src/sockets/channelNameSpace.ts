import { Server } from "socket.io";
import { SOCKET_EVENTS, SOCKET_NAMESPACES } from "../constants/socket";

export const initializeChannelNamespace = (io: Server) => {
  const channelNameSpace = io.of(SOCKET_NAMESPACES.CHANNEL);

  channelNameSpace.on(SOCKET_EVENTS.CHANNEL.CONNECTION, (socket) => {
    socket.on(SOCKET_EVENTS.CHANNEL.JOIN_CHANNEL, (channelId) => {
      socket.join(channelId);
    });

    socket.on(SOCKET_EVENTS.CHANNEL.LEAVE_CHANNEL, (channelId) => {
      socket.leave(channelId);
    });

    socket.on(SOCKET_EVENTS.CHANNEL.DISCONNECT, () => {});
  });
};
