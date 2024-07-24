import { ChannelResponse, ChannelType, Server } from "@/@types";
import { useDeleteServer } from "@/hooks/server";
import useModal from "@/hooks/useModal";
import { hasNewMessageOnChannel } from "@/utils/hasNewMessageOnChannel";
import { memo } from "react";
import { useParams } from "react-router-dom";
import { useDeleteChannel } from "../hooks";
import CreateChannelForm from "./CreateChannelForm";
import useMediaChatStore from "@/store/mediaStore";

const ChannelSideBar = ({
  channels,
  server,
  onClickChannels,
  userId,
}: {
  channels: ChannelResponse[];
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

  const getCurrentChannelStyle = (channelId: number) => {
    return channelId === parsedChannelId
      ? "text-secondary-light"
      : "text-white";
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
            <div
              key={channel.id}
              className={`h-12 bg-secondary-dark flex items-center cursor-pointer justify-between ${getCurrentChannelStyle(
                channel.id
              )}`}
              onClick={() => onClickChannels(channel.id, channel.type)}
            >
              <div className="flex items-center gap-4">
                {hasNewMessageOnChannel(
                  channel.lastMessageId,
                  channel.lastSeenMessageId
                ) && <div className="w-2 h-2 bg-green-500 rounded-full" />}
                <span>{channel.name}</span>
              </div>
              {server.ownerId === userId && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteChannel(channel.id);
                  }}
                >
                  채널 삭제
                </button>
              )}
            </div>
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
