import { Server } from 'socket.io'
import { SOCKET_EVENTS, SOCKET_NAMESPACES } from '../constants/socket'
import { getNamespace } from '.'
import { addUserToRoom, removeUserFromRoom } from '../lib/redis'

export const initializeMediaChatNamespace = (io: Server) => {
  const mediaChatNamespace = io.of(SOCKET_NAMESPACES.MEDIA_CHAT)

  mediaChatNamespace.on(SOCKET_EVENTS.MEDIA_CHAT.CONNECTION, (socket) => {
    socket.on(
      SOCKET_EVENTS.MEDIA_CHAT.JOIN,
      async ({ roomId, serverId, user }) => {
        try {
          socket.join(roomId)

          await addUserToRoom(roomId, user)

          const serverNameSpace = getNamespace(SOCKET_NAMESPACES.SERVER)

          serverNameSpace.emit(SOCKET_EVENTS.SERVER.ADD_USER_TO_CHANNEL, {
            channelId: roomId,
            user,
            serverId,
          })

          socket.to(roomId).emit(SOCKET_EVENTS.MEDIA_CHAT.NEW_PEER, {
            peerId: socket.id,
          })
        } catch (error) {
          console.error('Error joining room:', error)
          socket.emit('error', { message: 'Failed to join room' })
        }
      }
    )

    socket.on(
      SOCKET_EVENTS.MEDIA_CHAT.LEAVE,
      async ({ roomId, user, serverId }) => {
        try {
          socket.leave(roomId)

          await removeUserFromRoom(roomId, user)

          const serverNameSpace = getNamespace(SOCKET_NAMESPACES.SERVER)

          serverNameSpace.emit(SOCKET_EVENTS.SERVER.REMOVE_USER_FROM_CHANNEL, {
            channelId: roomId,
            userId: user.id,
            serverId,
          })

          // Notify other clients in the room about the participant leaving
          socket.to(roomId).emit(SOCKET_EVENTS.MEDIA_CHAT.PEER_LEFT, {
            peerId: socket.id,
          })
        } catch (error) {
          console.error('Error leaving room:', error)
          socket.emit('error', { message: 'Failed to leave room' })
        }
      }
    )

    socket.on(SOCKET_EVENTS.MEDIA_CHAT.SDP_OFFER, (data) => {
      try {
        const { roomId, sdpOffer, to } = data
        // console.log(`SDP Offer from ${socket.id} to room ${roomId}`);
        socket.to(to).emit(SOCKET_EVENTS.MEDIA_CHAT.SDP_OFFER, {
          sdpOffer,
          from: socket.id,
        })
      } catch (error) {
        console.error('Error handling SDP Offer:', error)
        socket.emit('error', { message: 'Failed to handle SDP Offer' })
      }
    })

    socket.on(SOCKET_EVENTS.MEDIA_CHAT.SDP_ANSWER, (data) => {
      try {
        const { roomId, sdpAnswer, to } = data
        // console.log(`SDP Answer from ${socket.id} to room ${roomId}`);
        socket.to(to).emit(SOCKET_EVENTS.MEDIA_CHAT.SDP_ANSWER, {
          sdpAnswer,
          from: socket.id,
        })
      } catch (error) {
        console.error('Error handling SDP Answer:', error)
        socket.emit('error', { message: 'Failed to handle SDP Answer' })
      }
    })

    socket.on(SOCKET_EVENTS.MEDIA_CHAT.ICE_CANDIDATE, (data) => {
      try {
        const { roomId, iceCandidate, to } = data
        socket.to(to).emit(SOCKET_EVENTS.MEDIA_CHAT.ICE_CANDIDATE, {
          iceCandidate,
          from: socket.id,
        })
      } catch (error) {
        console.error('Error handling ICE Candidate:', error)
        socket.emit('error', { message: 'Failed to handle ICE Candidate' })
      }
    })

    socket.on(SOCKET_EVENTS.MEDIA_CHAT.DISCONNECT, () => {
      try {
        // Add any required cleanup logic here
        console.log(`Client disconnected from media chat: ${socket.id}`)
      } catch (error) {
        console.error('Error handling disconnect:', error)
      }
    })
  })
}
