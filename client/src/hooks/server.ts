import {
  getAllUserServersWithChannelsResponse,
  Server,
  ServerResponse,
} from "@/@types";
import { createServer, deleteServer, joinServer } from "@/api/server";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { API_ROUTE } from "@/constants/routeName";
import { api, ApiError } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { produce } from "immer";
import useToast from "./useToast";

export const useCreateServer = ({
  successCallback,
}: {
  successCallback?: () => void;
} = {}) => {
  const queryClient = useQueryClient();

  const { showToast } = useToast();

  return useMutation<ServerResponse, ApiError, string>({
    mutationFn: (name: string) => createServer(name),
    onSuccess: async (newServer) => {
      queryClient.setQueryData<getAllUserServersWithChannelsResponse>(
        QUERY_KEYS.USER_SERVERS_WITH_CHANNELS,
        (oldData) => {
          if (!oldData) return oldData;
          return [...oldData, newServer];
        }
      );
      successCallback && successCallback();
    },
    onError: (error) => {
      console.error("Failed to create server:", error);
      showToast({
        message: error.message,
        type: "error",
      });
    },
  });
};

export const useDeleteServer = () => {
  const queryClient = useQueryClient();

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
  return useQuery<getAllUserServersWithChannelsResponse>({
    queryKey: QUERY_KEYS.USER_SERVERS_WITH_CHANNELS,
    queryFn: async ({ queryKey, pageParam }) => {
      return api.get(API_ROUTE.SERVER.GET_USER_SERVERS_WITH_CHANNELS, {});
    },
    retry: false,
    staleTime: Infinity,
  });
};

export const useJoinServer = ({}: {}) => {
  const queryClient = useQueryClient();

  const { showToast } = useToast();

  return useMutation<ServerResponse, ApiError, string>({
    mutationFn: (inviteCode: string) => joinServer({ inviteCode }),
    onSuccess: (newServer) => {
      queryClient.setQueryData<getAllUserServersWithChannelsResponse>(
        QUERY_KEYS.USER_SERVERS_WITH_CHANNELS,
        (oldData) => {
          if (!oldData) return oldData;
          return [...oldData, newServer];
        }
      );
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

  return queryClient.getQueryData<getAllUserServersWithChannelsResponse>([
    API_ROUTE.SERVER.GET_USER_SERVERS_WITH_CHANNELS,
  ]);
};
