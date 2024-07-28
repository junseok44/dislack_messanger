import { useCallback, useRef } from 'react'
import { useUpdateLastSeenMessage } from '.'
import { withCooldown } from '@/utils/withCooldown'
import { useListScrollObserver } from '@/hooks/useListScrollObserver'
import { hasNewMessageOnChannel } from '@/utils/hasNewMessageOnChannel'

const useMessageIntersectHandler = ({
  listTopRef,
  listEndRef,
  targetRef,
  isFetching,
  hasNextPage,
  fetchNextPage,
  parsedChannelId,
  lastSeenMessageId,
  messageData,
}: {
  listTopRef: React.RefObject<HTMLDivElement>
  listEndRef: React.RefObject<HTMLDivElement>
  targetRef: React.RefObject<HTMLDivElement>
  isFetching: boolean
  hasNextPage: boolean
  fetchNextPage: () => void
  parsedChannelId: number | undefined
  lastSeenMessageId: number | null
  messageData: any
}) => {
  const { mutate: updateLastSeenMessage } = useUpdateLastSeenMessage()

  const UpdateLastSeenMessageWithCoolDown = useCallback(
    withCooldown(({ channelId }) => {
      updateLastSeenMessage({ channelId })
    }, 1000),
    [updateLastSeenMessage]
  )

  useListScrollObserver({
    listTopRef,
    listEndRef,
    targetRef,
    onScrollTopIntersect: () => {
      if (hasNextPage && !isFetching) {
        fetchNextPage()
      }
    },
    onScrollBottomIntersect: () => {
      if (!parsedChannelId) return

      if (
        messageData &&
        messageData.pages[0].messages.length > 0 &&
        hasNewMessageOnChannel(
          messageData?.pages[0].messages[0].id,
          lastSeenMessageId
        )
      ) {
        UpdateLastSeenMessageWithCoolDown({ channelId: parsedChannelId })
      }
    },
  })
}

export default useMessageIntersectHandler
