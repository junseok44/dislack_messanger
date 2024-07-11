import { getAllMessagesResponse, Message } from "@/@types";
import { API_ROUTE } from "@/constants/routeName";
import { ApiError } from "@/lib/api";
import {
  InfiniteData,
  QueryKey,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { fetchMessages, sendMessage } from "./fetcher";
import { produce } from "immer";

export const useMessages = (channelId: number | undefined) => {
  return useInfiniteQuery<
    getAllMessagesResponse | undefined,
    Error,
    InfiniteData<getAllMessagesResponse, unknown>,
    QueryKey,
    {
      nextCursor: number | null;
    }
  >({
    queryKey: [API_ROUTE.MESSAGES.GET(channelId!), channelId],
    queryFn: ({ pageParam }) => {
      return fetchMessages(channelId!, pageParam.nextCursor);
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage || !lastPage.nextCursor) return undefined;

      return {
        nextCursor: lastPage.nextCursor,
      };
    },
    initialPageParam: {
      nextCursor: null,
    },
    enabled: channelId !== null,
    retry: false,
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Message,
    ApiError,
    { channelId: number; content: string; authorId: number },
    {
      previousMessages:
        | InfiniteData<{
            messages: Message[];
            nextCursor: number | null;
          }>
        | undefined;
      testId: number;
    }
  >({
    mutationFn: sendMessage,
    onMutate: async (newMessage) => {
      const { channelId } = newMessage;
      await queryClient.cancelQueries({
        queryKey: [API_ROUTE.MESSAGES.GET(channelId), channelId],
      });

      let testId = Date.now();

      const previousMessages = queryClient.getQueryData<
        InfiniteData<{ messages: Message[]; nextCursor: number | null }>
      >([API_ROUTE.MESSAGES.GET(channelId), channelId]);

      if (previousMessages) {
        queryClient.setQueryData(
          [API_ROUTE.MESSAGES.GET(channelId), channelId],
          produce(previousMessages, (draft) => {
            draft.pages.forEach((page, index) => {
              if (index === 0) {
                page.messages.unshift({
                  ...newMessage,
                  id: testId,
                  createdAt: new Date().toISOString(),
                });
              }
            });
          })
        );
      }

      return { previousMessages, testId };
    },
    onSuccess: (newMessage, variables, context) => {
      const { channelId } = variables;
      const { testId } = context;

      const previousMessages = queryClient.getQueryData<
        InfiniteData<{ messages: Message[]; nextCursor: number | null }>
      >([API_ROUTE.MESSAGES.GET(channelId), channelId]);

      if (previousMessages) {
        queryClient.setQueryData(
          [API_ROUTE.MESSAGES.GET(channelId), channelId],
          produce(previousMessages, (draft) => {
            draft.pages.forEach((page) => {
              page.messages = page.messages.map((message) =>
                message.id === testId ? { ...newMessage } : message
              );
            });
          })
        );
      }
    },
    onError: (err, newMessage, context) => {
      console.log(err);

      console.log(context?.previousMessages);

      const { channelId } = newMessage;
      if (context?.previousMessages) {
        queryClient.setQueryData(
          [API_ROUTE.MESSAGES.GET(channelId), channelId],
          context.previousMessages
        );
      }
    },
    onSettled: (newMessage, error, variables) => {},
  });
};
