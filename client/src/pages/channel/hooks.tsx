import {
  CreateMessageResponse,
  getAllMessagesResponse,
  Message,
  MessageWithAuthor,
} from "@/@types";
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
import { useEffect } from "react";
import { SOCKET_EVENTS } from "@/constants/sockets";
import { Socket } from "socket.io-client";
import { useAuth } from "@/contexts/AuthContext";

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

  const { user } = useAuth();

  return useMutation<
    Message,
    ApiError,
    { channelId: number; content: string; tempId: number },
    {
      previousMessages:
        | InfiniteData<{
            messages: Message[];
            nextCursor: number | null;
          }>
        | undefined;
      tempId: number;
    }
  >({
    mutationFn: sendMessage,
    onMutate: async (newMessage) => {
      const { channelId, tempId } = newMessage;
      await queryClient.cancelQueries({
        queryKey: [API_ROUTE.MESSAGES.GET(channelId), channelId],
      });

      const previousMessages = queryClient.getQueryData<
        InfiniteData<{
          messages: MessageWithAuthor[];
          nextCursor: number | null;
        }>
      >([API_ROUTE.MESSAGES.GET(channelId), channelId]);

      if (previousMessages) {
        queryClient.setQueryData(
          [API_ROUTE.MESSAGES.GET(channelId), channelId],
          produce(previousMessages, (draft) => {
            draft.pages.forEach((page, index) => {
              if (index === 0) {
                page.messages.unshift({
                  ...newMessage,
                  id: tempId,
                  createdAt: new Date().toISOString(),
                  isTemp: true,
                  authorId: tempId,
                  author: {
                    id: tempId,
                    username: user?.username || "temp",
                  },
                });
              }
            });
          })
        );
      }

      return { previousMessages, tempId };
    },
    onError: (err, newMessage, context) => {
      const { channelId } = newMessage;
      if (context?.previousMessages) {
        queryClient.setQueryData(
          [API_ROUTE.MESSAGES.GET(channelId), channelId],
          produce(context.previousMessages, (draft) => {
            draft.pages.forEach((page, index) => {
              if (index === 0) {
                // FIXME 이 부분 문제 생길수도.
                page.messages = page.messages.filter((message) => {
                  return message.isTemp !== true;
                });
              }
            });
          })
        );
      }
    },
    onSettled: (newMessage, error, variables) => {},
  });
};

export const useChannelSocket = (
  socket: Socket,
  channelId: string | undefined,
  parsedChannelId: number | undefined
) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!parsedChannelId) {
      console.log("No parsedChannelId provided");
      return;
    }

    socket.emit(SOCKET_EVENTS.JOIN_CHANNEL, channelId);

    const handleNewMessage = (newMessage: CreateMessageResponse) => {
      const queryKey = [
        API_ROUTE.MESSAGES.GET(parsedChannelId),
        parsedChannelId,
      ];

      const previousMessages =
        queryClient.getQueryData<
          InfiniteData<{ messages: Message[]; nextCursor: number | null }>
        >(queryKey);

      if (previousMessages) {
        queryClient.setQueryData(
          queryKey,
          produce(previousMessages, (draft) => {
            draft.pages.forEach((page, index) => {
              if (index === 0) {
                const existingMessageIndex = page.messages.findIndex(
                  (message) => message.id == newMessage.tempId
                );

                if (existingMessageIndex !== -1) {
                  page.messages[existingMessageIndex] = newMessage;
                } else {
                  page.messages.unshift(newMessage);
                }
              }
            });
          })
        );
      }
    };

    socket.on(SOCKET_EVENTS.NEW_MESSAGE, handleNewMessage);

    return () => {
      console.log("Leaving channel:", parsedChannelId);
      socket.emit(SOCKET_EVENTS.LEAVE_CHANNEL, parsedChannelId);
      socket.off(SOCKET_EVENTS.NEW_MESSAGE, handleNewMessage);
    };
  }, [channelId, queryClient]);
};
