import { Server } from "socket.io";
import { SOCKET_EVENTS, SOCKET_NAMESPACES } from "../constants/socket";

export const initializeMediaChatNamespace = (io: Server) => {
  const mediaChatNamespace = io.of(SOCKET_NAMESPACES.MEDIA_CHAT);

  mediaChatNamespace.on(SOCKET_EVENTS.MEDIA_CHAT.CONNECTION, (socket) => {
    socket.on(SOCKET_EVENTS.MEDIA_CHAT.JOIN, (roomId) => {
      socket.join(roomId);
      // console.log(`Client ${socket.id} joined room ${roomId}`);

      // Notify other clients in the room about the new participant
      socket.to(roomId).emit(SOCKET_EVENTS.MEDIA_CHAT.NEW_PEER, {
        peerId: socket.id,
      });
    });

    socket.on(SOCKET_EVENTS.MEDIA_CHAT.LEAVE, (roomId) => {
      socket.leave(roomId);

      // Notify other clients in the room about the participant leaving
      socket.to(roomId).emit(SOCKET_EVENTS.MEDIA_CHAT.PEER_LEFT, {
        peerId: socket.id,
      });
    });

    socket.on(SOCKET_EVENTS.MEDIA_CHAT.SDP_OFFER, (data) => {
      const { roomId, sdpOffer, to } = data;
      // console.log(`SDP Offer from ${socket.id} to room ${roomId}`);
      socket.to(to).emit(SOCKET_EVENTS.MEDIA_CHAT.SDP_OFFER, {
        sdpOffer,
        from: socket.id,
      });
    });

    socket.on(SOCKET_EVENTS.MEDIA_CHAT.SDP_ANSWER, (data) => {
      const { roomId, sdpAnswer, to } = data;
      // console.log(`SDP Answer from ${socket.id} to room ${roomId}`);
      socket.to(to).emit(SOCKET_EVENTS.MEDIA_CHAT.SDP_ANSWER, {
        sdpAnswer,
        from: socket.id,
      });
    });

    socket.on(SOCKET_EVENTS.MEDIA_CHAT.ICE_CANDIDATE, (data) => {
      const { roomId, iceCandidate, to } = data;
      // console.log(`ICE Candidate from ${socket.id} to room ${roomId}`);
      socket.to(to).emit(SOCKET_EVENTS.MEDIA_CHAT.ICE_CANDIDATE, {
        iceCandidate,
        from: socket.id,
      });
    });

    socket.on(SOCKET_EVENTS.MEDIA_CHAT.DISCONNECT, () => {
      // console.log(`Client disconnected from media chat: ${socket.id}`);
    });
  });
};
