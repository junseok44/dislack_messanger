import { Server } from "socket.io";
import { SOCKET_EVENTS, SOCKET_NAMESPACES } from "../constants/socket";

export const initializeServerNamespace = (io: Server) => {
  const serverNamespace = io.of(SOCKET_NAMESPACES.SERVER);

  serverNamespace.on(SOCKET_EVENTS.SERVER.CONNECTION, (socket) => {
    console.log("A user connected to server namespace", socket.id);

    socket.on(SOCKET_EVENTS.SERVER.SUBSCRIBE_SERVER, (serverIds: number[]) => {
      console.log("User subscribed to servers: ", serverIds);
      serverIds.forEach((serverId) => {
        socket.join(`server_${serverId}`);
      });
    });

    socket.on(
      SOCKET_EVENTS.SERVER.UNSUBSCRIBE_SERVER,
      (serverIds: number[]) => {
        console.log("User unsubscribed from servers: ", serverIds);
        serverIds.forEach((serverId) => {
          socket.leave(`server_${serverId}`);
        });
      }
    );

    socket.on(
      SOCKET_EVENTS.SERVER.ADD_CHANNEL,
      ({
        channel,
      }: {
        channel: {
          id: number;
          name: string;
          ownerId: number;
          serverId: number;
        };
      }) => {
        console.log(`Channel added to server ${channel.serverId}: `, channel);
        serverNamespace
          .to(`server_${channel.serverId}`)
          .emit(SOCKET_EVENTS.SERVER.ADD_CHANNEL, { channel });
      }
    );

    socket.on(SOCKET_EVENTS.SERVER.DELETE_CHANNEL, (serverId, channelId) => {
      console.log(`Channel deleted from server ${serverId}: ${channelId}`);

      serverNamespace
        .to(`server_${serverId}`)
        .emit(SOCKET_EVENTS.SERVER.DELETE_CHANNEL, { serverId, channelId });
    });

    socket.on(SOCKET_EVENTS.SERVER.DELETE_SERVER, (serverId) => {
      console.log(`Server deleted: ${serverId}`);

      serverNamespace
        .to(`server_${serverId}`)
        .emit(SOCKET_EVENTS.SERVER.DELETE_SERVER, { serverId });

      const clients = serverNamespace.adapter.rooms.get(`server_${serverId}`);
      if (clients) {
        clients.forEach((clientId) => {
          const clientSocket = serverNamespace.sockets.get(clientId);
          if (clientSocket) {
            clientSocket.leave(`server_${serverId}`);
          }
        });
      }
    });

    // Update the last message ID of a channel
    socket.on(
      SOCKET_EVENTS.SERVER.CHANNEL_UPDATE_LAST_MESSAGE_ID,
      (channelId, messageId) => {
        console.log(
          `Channel ${channelId} last message id updated: ${messageId}`
        );
        serverNamespace
          .to(`channel_${channelId}`)
          .emit(SOCKET_EVENTS.SERVER.CHANNEL_UPDATE_LAST_MESSAGE_ID, {
            channelId,
            messageId,
          });
      }
    );

    socket.on(SOCKET_EVENTS.SERVER.DISCONNECT, () => {
      console.log("User disconnected from server namespace", socket.id);
    });
  });
};
