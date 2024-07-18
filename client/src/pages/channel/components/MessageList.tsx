import { useListScrollObserver } from "@/hooks/useListScrollObserver";
import { hasNewMessageOnChannel } from "@/utils/hasNewMessageOnChannel";
import { withCooldown } from "@/utils/withCooldown";
import React, { memo, useCallback, useRef } from "react";
import {
  useAdjustListScrollTop,
  useMessages,
  useSetNewMessageId,
  useUpdateLastSeenMessage,
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
  const {
    data: messageData,
    hasNextPage,
    fetchNextPage,
    isFetching,
  } = useMessages(parsedChannelId);

  const allMessages =
    messageData?.pages.flatMap((page) => page.messages).reverse() || [];

  const { mutate: updateLastSeenMessage } = useUpdateLastSeenMessage();
  const listTopRef = useRef<HTMLDivElement | null>(null);
  const targetRef = useRef<HTMLDivElement | null>(null);

  useAdjustListScrollTop({
    targetRef,
    isFetching,
  });

  const UpdateLastSeenMessageWithCoolDown = useCallback(
    withCooldown(({ channelId }) => {
      updateLastSeenMessage({ channelId });
    }, 1000),
    [updateLastSeenMessage]
  );

  useListScrollObserver({
    listTopRef,
    listEndRef,
    targetRef,
    onScrollTopIntersect: () => {
      if (hasNextPage && !isFetching) {
        fetchNextPage();
      }
    },
    onScrollBottomIntersect: () => {
      if (!parsedChannelId) return;

      if (
        messageData &&
        messageData.pages[0].messages.length > 0 &&
        hasNewMessageOnChannel(
          messageData?.pages[0].messages[0].id,
          lastSeenMessageId
        )
      ) {
        // coolDown을 쓰는 이유는, intersect -> 리렌더링 -> intersect -> 리렌더링  이런식으로
        // 무한히 호출되는 것을 방지하기 위함.
        // 근데 왜 intersect가 무한히 호출되는거지?
        UpdateLastSeenMessageWithCoolDown({ channelId: parsedChannelId });
      }
    },
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
