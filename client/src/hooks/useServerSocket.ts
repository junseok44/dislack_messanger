import { Channel, getAllUserServersWithChannelsResponse } from "@/@types";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { PAGE_ROUTE } from "@/constants/routeName";
import { SOCKET_EVENTS, SOCKET_NAMESPACES } from "@/constants/sockets";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { useUserServersWithChannels } from "./server";

// TODO: 나중에 테스트할 부분. 만약 해당 서버, 해당 채널에 있었는데 삭제되었다? 그러면 navigate 되어야 함.

const socket = io(
  process.env.REACT_APP_API_URL + SOCKET_NAMESPACES.SERVER || ""
);

export const useServerSocket = () => {
  const queryClient = useQueryClient();

  const { serverId: serverParam, channelId: channelParam } = useParams<{
    serverId: string;
    channelId: string;
  }>();

  const currentServerId = parseInt(serverParam || "");
  const currentChannelId = parseInt(channelParam || "");

  const navigate = useNavigate();

  const { data } = useUserServersWithChannels();

  const allServerIds = useMemo(() => {
    return data?.map((server) => server.id);
  }, [JSON.stringify(data?.map((server) => server.id))]);

  const handleAddChannel = useCallback(
    ({ channel }: { channel: Channel }) => {
      queryClient.setQueryData<getAllUserServersWithChannelsResponse>(
        QUERY_KEYS.USER_SERVERS_WITH_CHANNELS,
        (data) => {
          if (!data) {
            return data;
          }

          const updatedData = data.map((server) => {
            if (server.id === channel.serverId) {
              return {
                ...server,
                channels: [
                  ...server.channels,
                  { ...channel, lastSeenMessageId: null },
                ],
              };
            }

            return server;
          });

          return updatedData;
        }
      );
    },
    [queryClient]
  );

  const handleDeleteChannel = useCallback(
    ({ serverId, channelId }: { serverId: number; channelId: number }) => {
      queryClient.setQueryData<getAllUserServersWithChannelsResponse>(
        QUERY_KEYS.USER_SERVERS_WITH_CHANNELS,
        (data) => {
          if (!data) {
            return data;
          }

          const updatedData = data.map((server) => {
            if (server.id === serverId) {
              return {
                ...server,
                channels: server.channels.filter(
                  (channel) => channel.id !== channelId
                ),
              };
            }

            return server;
          });

          return updatedData;
        }
      );
    },
    [queryClient, currentChannelId, navigate]
  );

  const handleDeleteServer = useCallback(
    ({ serverId }: { serverId: number }) => {
      console.log("Server deleted:", serverId, currentServerId);

      queryClient.setQueryData<getAllUserServersWithChannelsResponse>(
        QUERY_KEYS.USER_SERVERS_WITH_CHANNELS,
        (data) => {
          if (!data) {
            return data;
          }

          const updatedData = data.filter((server) => server.id !== serverId);

          return updatedData;
        }
      );
    },
    [queryClient, currentServerId, navigate]
  );

  const handleUpdateLastMessageId = useCallback(
    ({
      channelId,
      serverId,
      lastMessageId,
    }: {
      serverId: number;
      channelId: number;
      lastMessageId: number;
    }) => {
      queryClient.setQueryData<getAllUserServersWithChannelsResponse>(
        QUERY_KEYS.USER_SERVERS_WITH_CHANNELS,

        (data) => {
          if (!data) {
            return data;
          }

          const updatedData = data.map((server) => {
            if (server.id !== serverId) {
              return server;
            }

            return {
              ...server,
              channels: server.channels.map((channel) => {
                if (channel.id === channelId) {
                  return {
                    ...channel,
                    lastMessageId,
                  };
                }

                return channel;
              }),
            };
          });

          return updatedData;
        }
      );
    },
    [queryClient]
  );

  useEffect(() => {
    if (!allServerIds) {
      return;
    }

    console.log("Subscribing to servers:", allServerIds);
    socket.emit(SOCKET_EVENTS.SERVER.SUBSCRIBE_SERVER, allServerIds);

    socket.on(SOCKET_EVENTS.SERVER.DELETE_SERVER, handleDeleteServer);
    socket.on(SOCKET_EVENTS.SERVER.ADD_CHANNEL, handleAddChannel);
    socket.on(SOCKET_EVENTS.SERVER.DELETE_CHANNEL, handleDeleteChannel);
    socket.on(
      SOCKET_EVENTS.SERVER.CHANNEL_UPDATE_LAST_MESSAGE_ID,
      handleUpdateLastMessageId
    );

    return () => {
      console.log("Unsubscribing from servers:", allServerIds);

      socket.emit(SOCKET_EVENTS.SERVER.UNSUBSCRIBE_SERVER, allServerIds);
      socket.off(SOCKET_EVENTS.SERVER.ADD_CHANNEL, handleAddChannel);
      socket.off(SOCKET_EVENTS.SERVER.DELETE_CHANNEL, handleDeleteChannel);
      socket.off(SOCKET_EVENTS.SERVER.DELETE_SERVER, handleDeleteServer);
      socket.off(
        SOCKET_EVENTS.SERVER.CHANNEL_UPDATE_LAST_MESSAGE_ID,
        handleUpdateLastMessageId
      );
    };
  }, [allServerIds]);
};
