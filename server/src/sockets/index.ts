import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { initializeChannelNamespace } from "./channelNameSpace";
import { SOCKET_EVENTS, SOCKET_NAMESPACES } from "../constants/socket";
import { initializeServerNamespace } from "./serverNameSpace";
import { initializeMediaChatNamespace } from "./mediaChatNameSpace";

let io: Server | null = null;

export const initializeSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: "*", // 실제 프로덕션 환경에서는 허용할 도메인을 명시해야 합니다.
    },
  });

  initializeChannelNamespace(io);
  initializeServerNamespace(io);
  initializeMediaChatNamespace(io);
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

export const getNamespace = (
  namespace: (typeof SOCKET_NAMESPACES)[keyof typeof SOCKET_NAMESPACES]
) => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io.of(namespace);
};
