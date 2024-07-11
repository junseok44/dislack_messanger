import { Server } from "socket.io";
import { SOCKET_EVENTS, SOCKET_NAMESPACES } from "../constants/socket";

export const initializeChannelNamespace = (io: Server) => {
  const channelsNamespace = io.of(SOCKET_NAMESPACES.CHANNELS);

  channelsNamespace.on(SOCKET_EVENTS.CONNECTION, (socket) => {
    // console.log("a user connected to channels namespace");

    socket.on(SOCKET_EVENTS.JOIN_CHANNEL, (channelId) => {
      socket.join(channelId);
      // console.log(`User joined channel: ${channelId}`);
    });

    socket.on(SOCKET_EVENTS.LEAVE_CHANNEL, (channelId) => {
      socket.leave(channelId);
      // console.log(`User left channel: ${channelId}`);
    });

    socket.on(SOCKET_EVENTS.DISCONNECT, () => {
      // console.log("user disconnected from channels namespace");
    });
  });
};
