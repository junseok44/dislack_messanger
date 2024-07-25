import { Channel, Server } from "@/@types";
import useModal from "@/hooks/useModal";
import { hasNewMessageOnChannel } from "@/utils/hasNewMessageOnChannel";
import { memo } from "react";
import { useParams } from "react-router-dom";
import { useDeleteChannel } from "../hooks";
import CreateChannelForm from "./CreateChannelForm";
import useMediaChatStore from "@/store/mediaStore";
import { ChannelType } from "@/@types/channel";
import { useDeleteServer } from "@/hooks/server";

const ChannelItem = ({
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
  // if (channel.type === ChannelType.VOICE)
  // console.log(channel.channelParticipants);

  const getCurrentChannelStyle = (channelId: number) => {
    return channelId === currentChannelId
      ? "text-secondary-light"
      : "text-white";
  };

  return (
    <div className="flex flex-col">
      <div
        className={`h-12 flex items-center cursor-pointer justify-between ${
          channel.id === 1 ? "text-secondary-light" : "text-white"
        }`}
        onClick={() => onClickChannel(channel.id, channel.type)}
      >
        <div className="flex items-center gap-4">
          {hasNewMessageOnChannel(
            channel.lastMessageId,
            channel.lastSeenMessageId
          ) && <div className="w-2 h-2 bg-green-500 rounded-full" />}
          <span className={`${getCurrentChannelStyle(channel.id)}`}>
            {channel.name}
          </span>
        </div>
        {isOwner && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClickDeleteChannel(channel.id);
            }}
          >
            채널 삭제
          </button>
        )}
      </div>
      <div className="ml-4 flex flex-col">
        {channel.type === ChannelType.VOICE &&
          channel.channelParticipants.map((participant) => {
            return (
              <span key={participant.id} className="text-xs text-gray-400">
                {participant.username}
              </span>
            );
          })}
      </div>
    </div>
  );
};

const ChannelSideBar = ({
  channels,
  server,
  onClickChannels,
  userId,
}: {
  channels: Channel[];
  server: Pick<Server, "id" | "name" | "inviteCode" | "ownerId">;
  onClickChannels: (channelId: number, channelType: ChannelType) => void;
  userId?: number;
}) => {
  const { mutate: deleteServer } = useDeleteServer();
  const { mutate: deleteChannel } = useDeleteChannel();

  const { showModalWithControls, showModalWithoutControls, closeModal } =
    useModal();

  const { channelId } = useParams<{
    channelId: string;
  }>();

  const parsedChannelId = channelId ? parseInt(channelId) : undefined;

  const {
    mediaRoomId,
    disconnect,
    videoEnabled,
    toggleVideo,
    audioEnabled,
    toggleAudio,
  } = useMediaChatStore();

  const onClickDeleteServer = (id: number) => {
    showModalWithControls({
      title: "서버 삭제",
      text: "정말로 서버를 삭제하시겠습니까?\n삭제된 서버는 복구할 수 없습니다.",
      onConfirm: () => {
        deleteServer(id);
        closeModal();
      },
    });
  };

  const onClickAddChannel = () => {
    showModalWithoutControls({
      title: "채널 생성",
      children: <CreateChannelForm serverId={server.id} />,
    });
  };

  const handleDeleteChannel = (channelId: number) => {
    showModalWithControls({
      title: "채널 삭제",
      text: "정말로 채널을 삭제하시겠습니까?\n삭제된 채널은 복구할 수 없습니다.",
      onConfirm: () => {
        deleteChannel(channelId);
        closeModal();
      },
      onRequestClose: () => {
        closeModal();
      },
    });
  };

  return (
    <div className="w-60 bg-secondary-dark h-full flex-shrink-0 flex flex-col">
      <div className="mb-4">
        <div className="text-2xl ">{server.name}</div>
        <div>{server.inviteCode}</div>
      </div>
      {server.ownerId === userId && (
        <div className="flex justify-between mb-4">
          <button
            onClick={() => {
              onClickDeleteServer(server.id);
            }}
          >
            서버 삭제
          </button>
          <button onClick={onClickAddChannel}>채널 추가</button>
        </div>
      )}
      <div className="flex-grow">
        {channels.map((channel) => {
          return (
            <ChannelItem
              key={channel.id}
              channel={channel}
              onClickChannel={onClickChannels}
              isOwner={server.ownerId === userId}
              onClickDeleteChannel={handleDeleteChannel}
              currentChannelId={parsedChannelId}
            />
          );
        })}
      </div>
      <div className="bg-blue-500">
        {mediaRoomId && (
          <div className="bg-green-400 min-h-12">
            연결됨
            {mediaRoomId}번 방
            <button
              onClick={() => {
                toggleVideo();
              }}
            >
              {videoEnabled ? "비디오 끄기" : "비디오 켜기"}
            </button>
            <button
              onClick={() => {
                toggleAudio();
              }}
            >
              {audioEnabled ? "오디오 끄기" : "오디오 켜기"}
            </button>
            <button
              onClick={() => {
                disconnect();
              }}
            >
              연결끊기
            </button>
          </div>
        )}

        <div className="min-h-12"></div>
      </div>
    </div>
  );
};

export default memo(ChannelSideBar);
