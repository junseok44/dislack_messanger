import React from "react";
import { useMessages } from "../hooks";

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
              <div>{message.content}</div>
            </div>
          )}
        </li>
      ))}
      <div ref={listEndRef} />
    </ul>
  );
};

export default MessageList;
