import {
  CreateMessageResponse,
  getAllMessagesResponse,
  getAllUserServersWithChannelsResponse,
  Message,
  MessageWithAuthor,
} from "@/@types";
import { API_ROUTE } from "@/constants/routeName";
import { SOCKET_EVENTS, SOCKET_NAMESPACES } from "@/constants/sockets";
import { useAuth } from "@/contexts/AuthContext";
import useToast from "@/hooks/useToast";
import { ApiError } from "@/lib/api";
import {
  InfiniteData,
  QueryKey,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { produce } from "immer";
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import {
  createChannel,
  deleteChannel,
  fetchMessages,
  sendMessage,
  updateLastSeenMessage,
} from "./api";
import { QUERY_KEYS } from "@/constants/queryKeys";

export const useChannelSocket = (channelId: string | undefined) => {
  const queryClient = useQueryClient();
  const socketRef = useRef<Socket | null>(null);

  const parsedChannelId = channelId ? parseInt(channelId) : undefined;

  useEffect(() => {
    if (!parsedChannelId) {
      console.log("No parsedChannelId provided");
      return;
    }

    if (!socketRef.current) {
      socketRef.current = io(
        process.env.REACT_APP_API_URL + SOCKET_NAMESPACES.CHANNEL || ""
      );
    }

    const socket = socketRef.current;

    socket.emit(SOCKET_EVENTS.CHANNEL.JOIN_CHANNEL, channelId);

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

    socket.on(SOCKET_EVENTS.CHANNEL.NEW_MESSAGE, handleNewMessage);

    return () => {
      socket.emit(SOCKET_EVENTS.CHANNEL.LEAVE_CHANNEL, parsedChannelId);
      socket.off(SOCKET_EVENTS.CHANNEL.NEW_MESSAGE, handleNewMessage);
      socketRef.current = null;
      socket.disconnect();
    };
  }, [channelId, parsedChannelId, queryClient]);
};

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

  const { showToast } = useToast();

  return useMutation<
    Message,
    ApiError,
    {
      channelId: number;
      content: string;
      tempId: number;
      authorId: number;
      serverId: number;
    },
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
      const { channelId, tempId, authorId } = newMessage;
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
                  authorId,
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
      showToast({
        message: err.message,
        type: "error",
      });
    },
    onSettled: (newMessage, error, variables) => {},
  });
};

export const useCreateChannel = ({
  successCallback,
  errorCallback,
}: {
  successCallback?: () => void;
  errorCallback?: (error: any) => void;
} = {}) => {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (data: { name: string; serverId: number }) =>
      createChannel(data.name, data.serverId),
    onSuccess: async () => {
      successCallback && successCallback();
    },
    onError: (error) => {
      console.error("Failed to create channel:", error);
      showToast({
        message: error.message,
        type: "error",
      });
      errorCallback && errorCallback(error);
    },
  });
};

export const useDeleteChannel = () => {
  const queryClient = useQueryClient();

  const { showToast } = useToast();

  return useMutation({
    mutationFn: (id: number) => deleteChannel(id),
    onSuccess: () => {
      // queryClient.refetchQueries({
      //   queryKey: QUERY_KEYS.USER_SERVERS_WITH_CHANNELS,
      // });
      console.log("Channel deleted successfully");
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        showToast({
          message: error.message,
          type: "error",
        });
      }
    },
  });
};

export const useUpdateLastSeenMessage = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation<unknown, Error, { channelId: number | string }>({
    mutationFn: ({ channelId }) => updateLastSeenMessage(channelId),
    onSuccess: async (_, { channelId }) => {
      queryClient.setQueryData<getAllUserServersWithChannelsResponse>(
        QUERY_KEYS.USER_SERVERS_WITH_CHANNELS,
        (data) => {
          if (!data) return data;
          return produce(data, (draft) => {
            draft.forEach((server) => {
              server.channels.forEach((channel) => {
                if (channel.id === channelId) {
                  channel.lastSeenMessageId = channel.lastMessageId;
                }
              });
            });
          });
        }
      );
    },
    onError: (error) => {
      console.error("Failed to update last seen message:", error);
      showToast({
        message: error.message,
        type: "error",
      });
    },
  });
};
