import { CreateMessageResponse, Message } from "@/@types";
import { API_ROUTE } from "@/constants/routeName";
import { SOCKET_EVENTS, SOCKET_NAMESPACES } from "@/constants/sockets";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { produce } from "immer";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

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
