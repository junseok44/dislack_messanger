import { ChannelResponse, Server } from "@/@types";
import { useDeleteServer } from "@/hooks/server";
import useModal from "@/hooks/useModal";
import { hasNewMessageOnChannel } from "@/utils/hasNewMessageOnChannel";
import { memo } from "react";
import { useParams } from "react-router-dom";
import { useDeleteChannel } from "../hooks";
import CreateChannelForm from "./CreateChannelForm";

const ChannelSideBar = ({
  channels,
  server,
  onClickChannels,
  userId,
}: {
  channels: ChannelResponse[];
  server: Pick<Server, "id" | "name" | "inviteCode" | "ownerId">;
  onClickChannels: (channelId: number) => void;
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

  const onClickDeleteServer = (id: number) => {
    showModalWithControls({
      title: "Delete Server",
      text: "Are you sure you want to delete this server?",
      onConfirm: () => {
        deleteServer(id);
        closeModal();
      },
    });
  };

  const onClickAddChannel = () => {
    showModalWithoutControls({
      title: "Create Channel",
      children: <CreateChannelForm serverId={server.id} />,
    });
  };

  const handleDeleteChannel = (channelId: number) => {
    deleteChannel(channelId);
  };

  const getCurrentChannelStyle = (channelId: number) => {
    return channelId === parsedChannelId
      ? "text-secondary-light"
      : "text-white";
  };

  return (
    <div className="w-60 bg-secondary-dark h-full">
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

      {channels.map((channel) => {
        return (
          <div
            key={channel.id}
            className={`h-12 bg-secondary-dark flex items-center cursor-pointer justify-between ${getCurrentChannelStyle(
              channel.id
            )}`}
            onClick={() => onClickChannels(channel.id)}
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
  );
};

export default memo(ChannelSideBar);
