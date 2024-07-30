import { Channel } from '@/@types'
import { ChannelType } from '@/@types/channel'
import { hasNewMessageOnChannel } from '@/utils/hasNewMessageOnChannel'
import { Hash, Headphones, Trash2 } from 'lucide-react'
import s from '../styles/ChannelSideBar'
import Typography from '@/components/ui/Typography'

export const ChannelItem = ({
  channel,
  onClickChannel,
  isOwner,
  onClickDeleteChannel,
  isCurrentChannel,
}: {
  channel: Channel
  onClickChannel: (channelId: number, channelType: ChannelType) => void
  isOwner: boolean
  onClickDeleteChannel: (channelId: number) => void
  isCurrentChannel: boolean
}) => {
  return (
    <div className="flex flex-col">
      <div
        className={`relative ml-sidebar_gutter flex cursor-pointer items-center rounded-md hover:bg-background-dark-subtle ${isCurrentChannel ? 'bg-background-dark-muted' : null} `}
        onClick={() => onClickChannel(channel.id, channel.type)}
      >
        {hasNewMessageOnChannel(
          channel.lastMessageId,
          channel.lastSeenMessageId
        ) && (
          <div className="absolute left-[-3px] h-1.5 w-1.5 rounded-full bg-background-light"></div>
        )}

        <div className="flex flex-grow items-center justify-between gap-1 px-[8px] py-[6px] text-text-dark-subtle">
          <div className="flex items-center gap-1">
            {channel.type === ChannelType.VOICE ? (
              <Headphones size={16} />
            ) : (
              <Hash size={16} />
            )}

            <Typography size="medium" weight="normal">
              {channel.name}
            </Typography>
          </div>
          {isOwner && (
            <Trash2
              size={16}
              onClick={(e) => {
                e.stopPropagation()
                onClickDeleteChannel(channel.id)
              }}
              className="cursor-pointer hover:text-text-dark"
            />
          )}
        </div>
      </div>
      <div className="ml-6 flex flex-col">
        {channel.type === ChannelType.VOICE &&
          channel.channelParticipants.map((participant) => {
            return (
              <span key={participant.id} className="text-xs text-text-dark">
                {participant.username}
              </span>
            )
          })}
      </div>
    </div>
  )
}
