import {
  getAllMessagesResponse,
  getAllUserServersWithChannelsResponse,
  Message,
  MessageWithAuthor,
} from "@/@types";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { API_ROUTE } from "@/constants/routeName";
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
import {
  createChannel,
  deleteChannel,
  fetchMessages,
  sendMessage,
  updateLastSeenMessage,
} from "../api";
import { useSetNewMessageId } from "./useSetNewMessageId";
import { useChannelSocket } from "./useChannelSocket";
import { useAdjustListScrollTop } from "./useAdjustListScrollTop";
import { useChannelMessages } from "./useChannelMessages";
import useMessageIntersectHandler from "./useMessageIntersectHandler";

const useMessages = (channelId: number | undefined) => {
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

const useSendMessage = () => {
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
      // await queryClient.cancelQueries({
      //   queryKey: [API_ROUTE.MESSAGES.GET(channelId), channelId],
      // });

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
    onError: (err, variables, context) => {
      const { channelId, tempId } = variables;

      queryClient.setQueryData<
        InfiniteData<{
          messages: MessageWithAuthor[];
          nextCursor: number | null;
        }>
      >([API_ROUTE.MESSAGES.GET(channelId), channelId], (data) => {
        if (!data) return data;
        return produce(data, (draft) => {
          draft.pages.forEach((page, index) => {
            if (index === 0) {
              const existingMessageIndex = page.messages.findIndex(
                (message) => message.id === tempId
              );

              if (existingMessageIndex !== -1) {
                page.messages.splice(existingMessageIndex, 1);
              }
            }
          });
        });
      });

      showToast({
        message: "메시지 전송에 실패했습니다.",
        type: "error",
      });
    },
    onSettled: (newMessage, error, dd) => {},
  });
};

const useCreateChannel = ({
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

const useDeleteChannel = () => {
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

const useUpdateLastSeenMessage = () => {
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

export {
  useChannelSocket,
  useCreateChannel,
  useDeleteChannel,
  useMessages,
  useSendMessage,
  useSetNewMessageId,
  useUpdateLastSeenMessage,
  useAdjustListScrollTop,
  useMessageIntersectHandler,
  useChannelMessages,
};
