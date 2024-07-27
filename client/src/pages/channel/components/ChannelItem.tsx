import { Channel } from "@/@types";
import { ChannelType } from "@/@types/channel";
import { hasNewMessageOnChannel } from "@/utils/hasNewMessageOnChannel";
import { Hash, Headphones, Trash2 } from "lucide-react";
import s from "../styles/ChannelSideBar";
import Typography from "@/components/ui/Typography";

export const ChannelItem = ({
  channel,
  onClickChannel,
  isOwner,
  onClickDeleteChannel,
  currentChannelId,
}: {
  channel: Channel;
  onClickChannel: (channelId: number, channelType: ChannelType) => void;
  isOwner: boolean;
  onClickDeleteChannel: (channelId: number) => void;
  currentChannelId?: number;
}) => {
  const getCurrentChannelStyle = (channelId: number) => {
    return channelId === currentChannelId
      ? "text-white"
      : "text-text-light-muted";
  };

  return (
    <div className="flex flex-col">
      <div
        className={`flex items-center cursor-pointer hover:bg-background-dark-muted rounded-md ml-sidebar_gutter relative
          `}
        onClick={() => onClickChannel(channel.id, channel.type)}
      >
        {hasNewMessageOnChannel(
          channel.lastMessageId,
          channel.lastSeenMessageId
        ) && (
          <div className="absolute left-[-3px] w-1.5 h-1.5 bg-background-light rounded-full"></div>
        )}

        <div className="flex flex-grow items-center justify-between gap-1 text-text-dark-subtle px-[8px] py-[6px]">
          <div className="flex items-center gap-1">
            {channel.type === ChannelType.VOICE ? (
              <Headphones size={16} />
            ) : (
              <Hash size={16} />
            )}

            <Typography>{channel.name}</Typography>
          </div>
          {isOwner && (
            <Trash2
              size={16}
              onClick={(e) => {
                e.stopPropagation();
                onClickDeleteChannel(channel.id);
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
            );
          })}
      </div>
    </div>
  );
};
