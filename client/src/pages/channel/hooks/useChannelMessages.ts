import React, { useEffect } from "react";
import { useMessages } from ".";
import useToast from "@/hooks/useToast";

const useChannelMessages = ({
  parsedChannelId,
}: {
  parsedChannelId: number | undefined;
}) => {
  const {
    data: messageData,
    hasNextPage,
    fetchNextPage,
    isFetching,
    isError,
  } = useMessages(parsedChannelId);

  const { showToast } = useToast();

  const allMessages =
    messageData?.pages.flatMap((page) => page.messages).reverse() || [];

  useEffect(() => {
    if (isError) {
      showToast({
        type: "error",
        message: "메시지를 불러오는 중 오류가 발생했습니다.",
      });
    }
  }, [isError]);

  return {
    messageData,
    hasNextPage,
    fetchNextPage,
    isFetching,
    allMessages,
  };
};

export { useChannelMessages };
