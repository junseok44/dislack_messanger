import { getAllUserServersWithChannelsResponse } from "@/@types";
import { API_ROUTE } from "@/constants/routeName";
import { api } from "@/lib/api";
import { delay } from "@/utils/delay";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const useUserServersWithChannels = () => {
  return useQuery<getAllUserServersWithChannelsResponse>({
    queryKey: [API_ROUTE.SERVER.GET_USER_SERVERS_WITH_CHANNELS],
    queryFn: async ({ queryKey, pageParam }) => {
      await delay(500);

      return api.get(API_ROUTE.SERVER.GET_USER_SERVERS_WITH_CHANNELS, {});
    },
    retry: false,
  });
};

export const useGetUserServersWithChannels = () => {
  const queryClient = useQueryClient();

  return queryClient.getQueryData<getAllUserServersWithChannelsResponse>([
    API_ROUTE.SERVER.GET_USER_SERVERS_WITH_CHANNELS,
  ]);
};
