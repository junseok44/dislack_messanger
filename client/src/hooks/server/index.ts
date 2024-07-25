import { Server } from "@/@types";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { API_ROUTE, PAGE_ROUTE } from "@/constants/routeName";
import { api, ApiError } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useToast from "../useToast";
import useModal from "../useModal";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { getUserPlan } from "@/constants/stripe";
import { createServer, deleteServer, joinServer } from "@/api/server";
import {
  getAllUserServersWithChannelsResponse,
  ServerResponse,
} from "@/api/server/types";

export const useCreateServer = () => {
  const queryClient = useQueryClient();

  const { closeModal, showModalWithControls } = useModal();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const plan = getUserPlan(user?.planId || 0);

  return useMutation<ServerResponse, ApiError, string>({
    mutationFn: (name: string) => createServer(name),
    onMutate: async () => {
      closeModal();
    },
    onSuccess: async (newServer) => {
      queryClient.setQueryData<Server[]>(
        QUERY_KEYS.USER_SERVERS_WITH_CHANNELS,
        (oldData) => {
          if (!oldData) return oldData;

          const newServerWithChannels: Server = {
            ...newServer,
            channels: newServer.channels.map((channel) => ({
              ...channel,
              channelParticipants: [],
            })),
          };

          return [...oldData, newServerWithChannels];
        }
      );

      showToast({
        message: "성공적으로 서버를 생성했어요!",
        type: "success",
      });

      navigate(PAGE_ROUTE.GOTO_CHANNEL(newServer.id, newServer.channels[0].id));
    },
    onError: (error) => {
      console.log("onError");

      if (error instanceof ApiError && error.errorCode === 1017) {
        showModalWithControls({
          title: "서버 생성 제한 초과",
          text: `현재 ${plan?.servers}개의 서버를 생성할 수 있습니다.\n요금제를 업그레이드하시겠습니까?`,
          onConfirm: () => {
            navigate(PAGE_ROUTE.PRODUCTS);
          },
          onRequestClose: () => {
            closeModal();
          },
        });
      } else {
        showToast({
          message: error.message,
          type: "error",
        });
      }
    },
    onSettled: () => {
      console.log("onSettled");
    },
  });
};

export const useDeleteServer = () => {
  const { showToast } = useToast();

  return useMutation<unknown, ApiError, number>({
    mutationFn: (id: number) => deleteServer(id),
    onSuccess: async (_, id) => {
      console.log("Server deleted successfully");
    },
    onError: (error) => {
      console.error("Failed to delete server:", error);
      showToast({
        message: error.message,
        type: "error",
      });
    },
  });
};

export const useUserServersWithChannels = () => {
  return useQuery<Server[]>({
    queryKey: QUERY_KEYS.USER_SERVERS_WITH_CHANNELS,
    queryFn: async () => {
      const servers: getAllUserServersWithChannelsResponse = await api.get(
        API_ROUTE.SERVER.GET_USER_SERVERS_WITH_CHANNELS,
        {}
      );

      // 각 채널에 `channelParticipants` 필드를 추가합니다.
      const updatedServers = servers.map((server) => ({
        ...server,
        channels: server.channels.map((channel) => ({
          ...channel,
          channelParticipants: [], // 기본값으로 빈 배열 추가
        })),
      }));

      return updatedServers;
    },
    retry: false,
    staleTime: Infinity,
  });
};

export const useJoinServer = ({}: {}) => {
  const queryClient = useQueryClient();

  const { showToast } = useToast();

  const navigate = useNavigate();

  return useMutation<ServerResponse, ApiError, string>({
    mutationFn: (inviteCode: string) => joinServer({ inviteCode }),
    onSuccess: (newServer) => {
      queryClient.setQueryData<Server[]>(
        QUERY_KEYS.USER_SERVERS_WITH_CHANNELS,
        (oldData) => {
          if (!oldData) return oldData;

          const newServerWithChannels: Server = {
            ...newServer,
            channels: newServer.channels.map((channel) => ({
              ...channel,
              channelParticipants: [],
            })),
          };

          return [...oldData, newServerWithChannels];
        }
      );

      showToast({
        message: "성공적으로 서버에 참가했어요!",
        type: "success",
      });

      navigate(PAGE_ROUTE.GOTO_CHANNEL(newServer.id, newServer.channels[0].id));
    },
    onError: (error) => {
      console.error("Failed to join server:", error);
      showToast({
        message: error.message,
        type: "error",
      });
    },
  });
};

export const useGetUserServersWithChannels = () => {
  const queryClient = useQueryClient();

  return queryClient.getQueryData<Server[]>([
    API_ROUTE.SERVER.GET_USER_SERVERS_WITH_CHANNELS,
  ]);
};

export const useGetCurrentServerFromChannelId = (channelId: number | null) => {
  const queryClient = useQueryClient();

  if (!channelId) return undefined;

  const allServer = queryClient.getQueryData<Server[]>([
    API_ROUTE.SERVER.GET_USER_SERVERS_WITH_CHANNELS,
  ]);

  if (!allServer) return undefined;

  return allServer.find((server) =>
    server.channels.some((channel) => channel.id === channelId)
  );
};
