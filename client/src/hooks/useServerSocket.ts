import { Channel, getAllUserServersWithChannelsResponse } from "@/@types";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { PAGE_ROUTE } from "@/constants/routeName";
import { SOCKET_EVENTS, SOCKET_NAMESPACES } from "@/constants/sockets";
import { useModal } from "@/contexts/ModalContext";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { useUserServersWithChannels } from "./server";

// TODO: 나중에 테스트할 부분. 만약 해당 서버, 해당 채널에 있었는데 삭제되었다? 그러면 navigate 되어야 함.

// 서버 삭제시 이제 그 서버의 채널들에 있던 socket들도 다 끊어줘야 함.

const socket = io(
  process.env.REACT_APP_API_URL + SOCKET_NAMESPACES.SERVER || ""
);

// TODO: 모달이나, navigate 관련 hook을 사용할때,

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
  }, [data]);

  const isSubscribed = useRef(false);

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
                channels: [...server.channels, channel],
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
      console.log("Channel deleted:", channelId);

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

      if (currentChannelId === channelId) {
        navigate(PAGE_ROUTE.CHANNELS_ME);
        // showModal({
        //   title: "채널 삭제됨",
        //   text: "현재 채널이 삭제되었습니다. 홈으로 이동합니다.",
        //   showControls: true,
        //   onConfirm: () => {
        //     navigate(PAGE_ROUTE.CHANNELS_ME);
        //   },
        //   onRequestClose: () => {
        //     navigate(PAGE_ROUTE.CHANNELS_ME);
        //   },
        // });
      }
    },
    [queryClient, currentChannelId, navigate]
  );

  const handleDeleteServer = useCallback(
    ({ serverId }: { serverId: number }) => {
      console.log("Server deleted:", serverId, currentServerId);

      if (currentServerId === serverId) {
        navigate(PAGE_ROUTE.CHANNELS_ME);
        // showModal({
        //   title: "서버 삭제됨",
        //   text: "현재 서버가 삭제되었습니다. 홈으로 이동합니다.",
        //   showControls: true,
        //   onConfirm: () => {
        //     navigate(PAGE_ROUTE.CHANNELS_ME);
        //   },
        //   onRequestClose: () => {
        //     navigate(PAGE_ROUTE.CHANNELS_ME);
        //   },
        // });
      }

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

  useEffect(() => {
    if (!allServerIds) {
      return;
    }

    if (!isSubscribed.current) {
      isSubscribed.current = true;
      console.log("Subscribing to servers:", allServerIds);

      socket.emit(SOCKET_EVENTS.SERVER.SUBSCRIBE_SERVER, allServerIds);
    }

    socket.on(SOCKET_EVENTS.SERVER.DELETE_SERVER, handleDeleteServer);
    socket.on(SOCKET_EVENTS.SERVER.ADD_CHANNEL, handleAddChannel);
    socket.on(SOCKET_EVENTS.SERVER.DELETE_CHANNEL, handleDeleteChannel);

    return () => {
      socket.emit(SOCKET_EVENTS.SERVER.UNSUBSCRIBE_SERVER, allServerIds);
      socket.off(SOCKET_EVENTS.SERVER.ADD_CHANNEL, handleAddChannel);
      socket.off(SOCKET_EVENTS.SERVER.DELETE_CHANNEL, handleDeleteChannel);
      socket.off(SOCKET_EVENTS.SERVER.DELETE_SERVER, handleDeleteServer);
    };
  }, [allServerIds]);
};
