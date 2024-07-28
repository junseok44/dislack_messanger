import React, { memo, useRef } from 'react'
import {
  useAdjustListScrollTop,
  useChannelMessages,
  useMessageIntersectHandler,
  useSetNewMessageId,
} from '../hooks'
import MessageItem from './MessageItem'
import { MessageWithAuthor } from '@/@types'
import Typography from '@/components/ui/Typography'
import { Hash, User } from 'lucide-react'
import { formatDateString } from '@/utils/formatDateString'

const MessageItemHead = ({
  message,
  isNewMessage,
}: {
  message: MessageWithAuthor
  isNewMessage?: boolean
}) => {
  return (
    <div className="ml-message_list_gutter mt-6 flex py-1">
      <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-background-dark-muted">
        <User size={24} />
      </div>
      <div className="flex flex-col justify-between">
        <div className="flex items-end gap-2">
          <Typography>{message.author.username}</Typography>
          <Typography weight="light" size="small">
            {formatDateString(message.createdAt)}
          </Typography>
        </div>

        <Typography color={message.isTemp ? 'secondary' : 'primary'}>
          {message.content}
        </Typography>
      </div>
    </div>
  )
}

const MessageItemPlaceholder = () => {
  return <div className="ml-message_list_normal_item_gutter h-4 py-1"></div>
}

const MessageListPlaceholder = () => {
  return (
    <>
      <div className="flex h-6 items-center bg-blue-400 pl-1">
        메시지를 불러오는 중입니다.
      </div>
      {Array.from({ length: 30 }).map((_, index) => (
        <div className="ml-message_list_gutter mt-6 flex py-1" key={index}>
          <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-background-dark-muted">
            <User size={24} />
          </div>
          <div className="flex animate-pulse flex-col justify-between">
            <div className="flex items-end gap-2">
              <div className="rouned-full h-4 w-20 bg-background-dark-muted"></div>
              <div className="rouned-full h-4 w-20 bg-background-dark-muted"></div>
            </div>
            <div className="rouned-full h-4 w-60 bg-background-dark-muted"></div>
          </div>
        </div>
      ))}
    </>
  )
}

const MessageItemNormal = ({
  message,
  isNewMessage,
}: {
  message: MessageWithAuthor
  isNewMessage?: boolean
}) => {
  return (
    <div className="ml-message_list_normal_item_gutter py-1">
      <Typography color={message.isTemp ? 'secondary' : 'primary'}>
        {message.content}
      </Typography>
    </div>
  )
}

const ChannelGreetings = ({ channelName }: { channelName: string }) => {
  return (
    <li className="ml-message_list_gutter flex min-h-80 flex-grow items-end">
      <div className="flex flex-col">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-background-dark-muted">
          <Hash size={48} />
        </div>
        <div className="h-4"></div>
        <h1 className="text-4xl">{channelName} 채널에 오신 것을 환영합니다!</h1>
        <p className="text-lg text-text-light-muted">
          여기는 이 채널의 시작입니다.
        </p>
      </div>
    </li>
  )
}

const MessageList = ({
  listEndRef,
  parsedChannelId,
  channelName,
  lastSeenMessageId,
}: {
  // listEnd는 MessgeInput에서도 사용되기 때문에, 외부에서 받아옴.
  listEndRef: React.RefObject<HTMLDivElement>
  parsedChannelId: number | undefined
  channelName: string
  lastSeenMessageId: number | null
}) => {
  const { messageData, hasNextPage, fetchNextPage, isFetching, allMessages } =
    useChannelMessages({
      parsedChannelId,
    })

  const listTopRef = useRef<HTMLDivElement | null>(null)
  const targetRef = useRef<HTMLDivElement | null>(null)

  useAdjustListScrollTop({
    targetRef,
    isFetching,
  })

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
  })

  const newMessageId = useSetNewMessageId({
    isFetching,
    allMessages,
    lastSeenMessageId,
    hasNextPage: !!hasNextPage,
  })

  return (
    <>
      <div className="absolute z-10 flex h-6 w-full items-center bg-blue-400 pl-1">
        <Typography>
          {isFetching
            ? '메시지를 불러오는 중입니다.'
            : `${allMessages.length}개의 메시지를 불러왔습니다.`}
        </Typography>
      </div>
      <div
        className="relative flex flex-grow flex-col overflow-auto"
        ref={targetRef}
      >
        <ul className="border-top-4 flex flex-grow flex-col border-red-400 pb-4">
          {!isFetching && !hasNextPage && (
            <ChannelGreetings channelName={channelName} />
          )}
          {isFetching && <MessageListPlaceholder />}
          <div ref={listTopRef} className="top" />
          {!isFetching && hasNextPage && <div className="h-12"></div>}
          {allMessages?.map((message, index) => {
            const previousMessage = allMessages[index - 1]
            const isNewMessage = newMessageId === message.id

            if (previousMessage?.authorId === message.authorId) {
              return (
                <MessageItemNormal
                  key={message.id}
                  message={message}
                  isNewMessage={isNewMessage}
                />
              )
            }

            return (
              <MessageItemHead
                key={message.id}
                message={message}
                isNewMessage={isNewMessage}
              />
            )
          })}

          <div ref={listEndRef} className="bottom" />
          {hasNextPage &&
            Array.from({ length: 10 }).map((_, index) => (
              <MessageItemPlaceholder key={index} />
            ))}
        </ul>
      </div>
    </>
  )
}

export default memo(MessageList)
