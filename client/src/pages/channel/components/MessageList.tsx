import React, { memo, useRef } from "react";
import {
  useAdjustListScrollTop,
  useChannelMessages,
  useMessageIntersectHandler,
  useSetNewMessageId,
} from "../hooks";
import MessageItem from "./MessageItem";

const MessageList = ({
  listEndRef,
  parsedChannelId,
  channelName,
  lastSeenMessageId,
}: {
  // listEnd는 MessgeInput에서도 사용되기 때문에, 외부에서 받아옴.
  listEndRef: React.RefObject<HTMLDivElement>;
  parsedChannelId: number | undefined;
  channelName: string;
  lastSeenMessageId: number | null;
}) => {
  const { messageData, hasNextPage, fetchNextPage, isFetching, allMessages } =
    useChannelMessages({
      parsedChannelId,
    });

  const listTopRef = useRef<HTMLDivElement | null>(null);
  const targetRef = useRef<HTMLDivElement | null>(null);

  useAdjustListScrollTop({
    targetRef,
    isFetching,
  });

  useMessageIntersectHandler({
    listTopRef,
    listEndRef,
    targetRef,
    isFetching,
    hasNextPage,
    fetchNextPage,
    parsedChannelId,
    lastSeenMessageId,
    messageData,
  });

  const newMessageId = useSetNewMessageId({
    isFetching,
    allMessages,
    lastSeenMessageId,
    hasNextPage: !!hasNextPage,
  });

  return (
    <div
      className="relative flex-grow flex flex-col overflow-auto"
      ref={targetRef}
    >
      {/* <div className="sticky h-6 bg-blue-400 z-10 w-full">
        읽지않은 메시지가 {newMessageCount}개 있어요
      </div> */}
      {!isFetching && !hasNextPage && (
        <li className="flex-grow min-h-60 flex items-end">
          <div className="flex flex-col">
            <h1 className="text-2xl">
              {channelName} 채널에 오신 것을 환영합니다!
            </h1>
            <p>여기는 이 채널의 시작입니다.</p>
          </div>
        </li>
      )}
      <ul className="border-top-4 border-red-400">
        {isFetching && (
          <>
            <div className="h-6 bg-blue-400">메시지를 불러오는 중입니다.</div>
            {Array.from({ length: 10 }).map((_, index) => (
              <li key={index} className="flex animate-pulse h-20 gap-2">
                <div className="w-32 bg-gray-300 rounded-full h-8"></div>
                <div className="bg-gray-300 rounded-full h-8 w-80"></div>
              </li>
            ))}
          </>
        )}
        <div ref={listTopRef} className="top" />
        {/* 새로운 데이터가 들어오고 나서 바로 fetch가 일어나는걸 방지하기 위한 완충 공간 */}
        {!isFetching && hasNextPage && (
          <div className="h-12">
            {/* <div className="h-6 bg-red-300"></div> */}
            {/* <div className="h-6 bg-blue-300"></div> */}
          </div>
        )}
        {allMessages?.map((message, index) => {
          return (
            <MessageItem
              key={index}
              message={message}
              previousMessage={allMessages[index - 1]}
              isNewMessage={newMessageId === message.id}
            />
          );
        })}
        <div ref={listEndRef} className="bottom" />
      </ul>
    </div>
  );
};

export default memo(MessageList);
