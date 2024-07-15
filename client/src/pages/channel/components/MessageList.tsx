import React, { useEffect } from "react";
import { useMessages, useUpdateLastSeenMessage } from "../hooks";

const MessageList = ({
  listEndRef,
  parsedChannelId,
}: {
  listEndRef: React.RefObject<HTMLDivElement>;
  parsedChannelId: number | undefined;
}) => {
  const {
    data: messageData,
    hasNextPage,
    fetchNextPage,
  } = useMessages(parsedChannelId);

  const { mutate: updateLastSeenMessage } = useUpdateLastSeenMessage();

  useEffect(() => {
    if (!parsedChannelId) return;

    // TODO: 신규 메시지 열람 조건 나중에 바꾸기. 디스코드의 경우 가장 최근 메시지를 읽으면 모든 메시지가 읽힌 것으로 처리되었음.
    updateLastSeenMessage({ channelId: parsedChannelId });
  }, [parsedChannelId, updateLastSeenMessage]);

  const allMessages =
    messageData?.pages.flatMap((page) => page.messages).reverse() || [];

  return (
    <ul className="flex-grow overflow-auto">
      {allMessages?.map((message, index) => (
        <li
          key={message.id}
          className={`${message.isTemp ? `text-warning-light` : ``}`}
        >
          {allMessages[index - 1]?.authorId == message.authorId ? (
            <div className="flex">
              <div className="w-32"></div>
              <div>{message.content}</div>
            </div>
          ) : (
            <div className="flex">
              <div className="w-32">{message.author.username}</div>
              <div className="max-w-full">{message.content}</div>
            </div>
          )}
        </li>
      ))}
      <div ref={listEndRef} />
    </ul>
  );
};

export default MessageList;
