import { Channel, Server, User } from '@/@types'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { SOCKET_EVENTS, SOCKET_NAMESPACES } from '@/constants/sockets'
import { useAuth } from '@/contexts/AuthContext'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { io } from 'socket.io-client'
import { useUserServersWithChannels } from '.'

// 이 부분 socket 연결 자체도 바꿔야 함. 해당 컴포넌트 마운트될때로 바꿀 것.
const socket = io(
  process.env.REACT_APP_API_URL + SOCKET_NAMESPACES.SERVER || ''
)

export const useServerSocket = () => {
  const queryClient = useQueryClient()

  const { serverId: serverParam, channelId: channelParam } = useParams<{
    serverId: string
    channelId: string
  }>()

  const currentServerId = parseInt(serverParam || '')
  const currentChannelId = parseInt(channelParam || '')

  const navigate = useNavigate()

  const { data } = useUserServersWithChannels()

  const { user } = useAuth()

  const allServerIds = useMemo(() => {
    return data?.map((server) => server.id)
  }, [JSON.stringify(data?.map((server) => server.id))])

  const handleAddChannel = useCallback(
    ({ channel }: { channel: Channel }) => {
      queryClient.setQueryData<Server[]>(
        QUERY_KEYS.USER_SERVERS_WITH_CHANNELS,
        (data) => {
          if (!data) {
            return data
          }

          const updatedData = data.map((server) => {
            if (server.id === channel.serverId) {
              return {
                ...server,
                channels: [
                  ...server.channels,
                  {
                    ...channel,
                    lastSeenMessageId: null,
                    channelParticipants: [],
                  },
                ],
              }
            }

            return server
          })

          return updatedData
        }
      )
    },
    [queryClient]
  )

  const handleDeleteChannel = useCallback(
    ({ serverId, channelId }: { serverId: number; channelId: number }) => {
      queryClient.setQueryData<Server[]>(
        QUERY_KEYS.USER_SERVERS_WITH_CHANNELS,
        (data) => {
          if (!data) {
            return data
          }

          const updatedData = data.map((server) => {
            if (server.id === serverId) {
              return {
                ...server,
                channels: server.channels.filter(
                  (channel) => channel.id !== channelId
                ),
              }
            }

            return server
          })

          return updatedData
        }
      )
    },
    [queryClient, currentChannelId, navigate]
  )

  const handleDeleteServer = useCallback(
    ({ serverId }: { serverId: number }) => {
      console.log('Server deleted:', serverId, currentServerId)

      queryClient.setQueryData<Server[]>(
        QUERY_KEYS.USER_SERVERS_WITH_CHANNELS,
        (data) => {
          if (!data) {
            return data
          }

          const updatedData = data.filter((server) => server.id !== serverId)

          return updatedData
        }
      )
    },
    [queryClient, currentServerId, navigate]
  )

  const handleUpdateLastMessageId = useCallback(
    ({
      channelId,
      serverId,
      lastMessageId,
      authorId,
    }: {
      serverId: number
      channelId: number
      lastMessageId: number
      authorId: number
    }) => {
      queryClient.setQueryData<Server[]>(
        QUERY_KEYS.USER_SERVERS_WITH_CHANNELS,

        (data) => {
          if (!data) {
            return data
          }

          const updatedData = data.map((server) => {
            if (server.id !== serverId) {
              return server
            }

            return {
              ...server,
              channels: server.channels.map((channel) => {
                if (channel.id === channelId) {
                  return {
                    ...channel,
                    lastMessageId,
                    // 만약에 마지막 메시지를 보낸 사람이 현재 유저라면, lastSeenMessageId를 업데이트 해준다. 무조건 읽었으니까.
                    lastSeenMessageId:
                      authorId === user?.id
                        ? lastMessageId
                        : channel.lastSeenMessageId,
                  }
                }

                return channel
              }),
            }
          })

          return updatedData
        }
      )
    },
    [queryClient]
  )

  const handleAddUserToChannel = useCallback(
    ({
      channelId,
      user,
      serverId,
    }: {
      channelId: number
      user: User
      serverId: number
    }) => {
      queryClient.setQueryData<Server[]>(
        QUERY_KEYS.USER_SERVERS_WITH_CHANNELS,
        (data) => {
          if (!data) {
            return data
          }

          const updatedData = data.map((server) => {
            if (server.id !== serverId) {
              return server
            }

            return {
              ...server,
              channels: server.channels.map((channel) => {
                if (channel.id === channelId) {
                  return {
                    ...channel,
                    channelParticipants: [...channel.channelParticipants, user],
                  }
                }

                return channel
              }),
            }
          })

          return updatedData
        }
      )
    },
    [queryClient]
  )

  const handleRemoveUserFromChannel = useCallback(
    ({
      channelId,
      userId,
      serverId,
    }: {
      channelId: number
      userId: number
      serverId: number
    }) => {
      console.log('Removing user from channel:', channelId, userId, serverId)

      queryClient.setQueryData<Server[]>(
        QUERY_KEYS.USER_SERVERS_WITH_CHANNELS,
        (data) => {
          if (!data) {
            return data
          }

          const updatedData = data.map((server) => {
            if (server.id !== serverId) {
              return server
            }

            return {
              ...server,
              channels: server.channels.map((channel) => {
                if (channel.id === channelId) {
                  return {
                    ...channel,
                    channelParticipants: channel.channelParticipants.filter(
                      (user) => user.id !== userId
                    ),
                  }
                }

                return channel
              }),
            }
          })

          return updatedData
        }
      )
    },
    [queryClient]
  )

  useEffect(() => {
    if (!allServerIds) {
      return
    }

    socket.emit(SOCKET_EVENTS.SERVER.SUBSCRIBE_SERVER, allServerIds)

    socket.on(SOCKET_EVENTS.SERVER.DELETE_SERVER, handleDeleteServer)
    socket.on(SOCKET_EVENTS.SERVER.ADD_CHANNEL, handleAddChannel)
    socket.on(SOCKET_EVENTS.SERVER.DELETE_CHANNEL, handleDeleteChannel)
    socket.on(
      SOCKET_EVENTS.SERVER.CHANNEL_UPDATE_LAST_MESSAGE_ID,
      handleUpdateLastMessageId
    )
    socket.on(SOCKET_EVENTS.SERVER.ADD_USER_TO_CHANNEL, handleAddUserToChannel)
    socket.on(
      SOCKET_EVENTS.SERVER.REMOVE_USER_FROM_CHANNEL,
      handleRemoveUserFromChannel
    )

    return () => {
      // console.log("Unsubscribing from servers:", allServerIds);

      socket.emit(SOCKET_EVENTS.SERVER.UNSUBSCRIBE_SERVER, allServerIds)
      socket.off(SOCKET_EVENTS.SERVER.ADD_CHANNEL, handleAddChannel)
      socket.off(SOCKET_EVENTS.SERVER.DELETE_CHANNEL, handleDeleteChannel)
      socket.off(SOCKET_EVENTS.SERVER.DELETE_SERVER, handleDeleteServer)
      socket.off(
        SOCKET_EVENTS.SERVER.CHANNEL_UPDATE_LAST_MESSAGE_ID,
        handleUpdateLastMessageId
      )
      socket.off(
        SOCKET_EVENTS.SERVER.ADD_USER_TO_CHANNEL,
        handleAddUserToChannel
      )
      socket.off(
        SOCKET_EVENTS.SERVER.REMOVE_USER_FROM_CHANNEL,
        handleRemoveUserFromChannel
      )
    }
  }, [allServerIds])
}
