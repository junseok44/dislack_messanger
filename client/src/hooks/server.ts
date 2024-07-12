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

export const useCreateServer = ({
  successCallback,
  errorCallback,
}: {
  successCallback?: () => void;
  errorCallback?: (error: any) => void;
} = {}) => {
  const queryClient = useQueryClient();

  return useMutation<ServerResponse, ApiError, string>({
    mutationFn: (name: string) => createServer(name),
    onSuccess: async (newServer) => {
      console.log(newServer);

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
      errorCallback && errorCallback(error);
    },
  });
};

export const useDeleteServer = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, ApiError, number>({
    mutationFn: (id: number) => deleteServer(id),
    onSuccess: async (_, id) => {
      console.log(
        queryClient
          .getQueryData<getAllUserServersWithChannelsResponse>(
            QUERY_KEYS.USER_SERVERS_WITH_CHANNELS
          )
          ?.find((server) => server.id === id)
      );

      queryClient.setQueryData<getAllUserServersWithChannelsResponse>(
        QUERY_KEYS.USER_SERVERS_WITH_CHANNELS,
        (oldData) => {
          if (!oldData) return oldData;
          return produce(oldData, (draft) => {
            const index = draft.findIndex((server) => server.id === id);
            if (index > -1) {
              draft.splice(index, 1);
            }
          });
        }
      );
      console.log("Server deleted successfully");
    },
    onError: (error) => {
      console.error("Failed to delete server:", error);
    },
  });
};

export const useUserServersWithChannels = () => {
  return useQuery<getAllUserServersWithChannelsResponse>({
    queryKey: QUERY_KEYS.USER_SERVERS_WITH_CHANNELS,
    queryFn: async ({ queryKey, pageParam }) => {
      console.log("useUserServersWithChannels");

      return api.get(API_ROUTE.SERVER.GET_USER_SERVERS_WITH_CHANNELS, {});
    },
    retry: false,
  });
};

export const useJoinServer = ({
  successCallback,
  errorCallback,
}: {
  successCallback?: () => void;
  errorCallback?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();

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
      errorCallback && errorCallback(error);
    },
  });
};

export const useGetUserServersWithChannels = () => {
  const queryClient = useQueryClient();

  return queryClient.getQueryData<getAllUserServersWithChannelsResponse>([
    API_ROUTE.SERVER.GET_USER_SERVERS_WITH_CHANNELS,
  ]);
};
