import { MessageWithAuthor } from "@/@types";
import { memo } from "react";

const MessageItem = ({
  message,
  previousMessage,
  isNewMessage,
}: {
  message: MessageWithAuthor;
  previousMessage?: MessageWithAuthor;
  isNewMessage?: boolean;
}) => {
  return (
    <>
      {isNewMessage && (
        <div className="h-1 flex w-full items-center gap-2">
          <p className="text-sm text-nowrap text-red-400">New</p>
          <div className="h-0.5 bg-red-400 w-full"></div>
        </div>
      )}
      <li
        key={message.id}
        className={`${
          message.isTemp ? `text-warning-light` : ``
        } flex h-20 gap-2 relative`}
      >
        {previousMessage?.authorId === message.authorId ? (
          <div className="w-32"></div>
        ) : (
          <div className="w-32">{message.author.username}</div>
        )}
        <div>{message.content}</div>
      </li>
    </>
  );
};

export default memo(MessageItem);
