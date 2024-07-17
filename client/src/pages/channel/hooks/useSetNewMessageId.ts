import { MessageWithAuthor } from "@/@types";
import { useEffect, useState } from "react";

const useSetNewMessageId = ({
  isFetching,
  allMessages,
  lastSeenMessageId,
  hasNextPage,
}: {
  isFetching: boolean;
  allMessages: MessageWithAuthor[] | null;
  lastSeenMessageId: number | null;
  hasNextPage: boolean;
}) => {
  const [newMessageId, setNewMessageId] = useState<number | null>(null);

  useEffect(() => {
    if (isFetching && !allMessages) return;

    if (!allMessages) return;

    if (allMessages.length === 0) {
      setNewMessageId(null);
      return;
    }

    const targetIndex = allMessages.findIndex(
      (message) => message.id === lastSeenMessageId
    );

    // 현재 내 메시지 중에서는 lastSeenMessageId가 없는 경우.
    if (targetIndex === -1 && hasNextPage) {
      setNewMessageId(allMessages[0].id);
      return;
    }

    // 만약 다 읽었다면,
    if (targetIndex === allMessages.length - 1) {
      setNewMessageId(null);
      return;
    }

    // 다음 메시지가 있다면, 즉 lastSeen 이후로 메시지가 추가가 되었다면.
    if (
      allMessages.length - 1 >= targetIndex + 1 &&
      !allMessages[targetIndex + 1].isTemp
    ) {
      setNewMessageId(allMessages[targetIndex + 1].id);
    }
  }, [lastSeenMessageId, allMessages]);

  return newMessageId;
};

export { useSetNewMessageId };
