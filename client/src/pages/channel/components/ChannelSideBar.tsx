import { memo } from "react";
import { Channel, Server } from "@/@types";
import { useModal } from "@/contexts/ModalContext";
import { useDeleteServer } from "@/hooks/server";
import CreateChannelForm from "./CreateChannelForm";
import { useDeleteChannel } from "../hooks";
import { useParams } from "react-router-dom";

const ChannelSideBar = ({
  channels,
  server,
  onClickChannels,
  userId,
}: {
  channels: Channel[];
  server: Pick<Server, "id" | "name" | "inviteCode" | "ownerId">;
  onClickChannels: (channelId: number) => void;
  userId?: number;
}) => {
  const { mutate } = useDeleteServer();

  const { mutate: deleteChannel } = useDeleteChannel();

  const { showModal, closeModal } = useModal();

  const { channelId } = useParams<{
    channelId: string;
  }>();

  const parsedChannelId = channelId ? parseInt(channelId) : undefined;

  const onClickDeleteServer = (id: number) => {
    showModal({
      title: "Delete Server",
      text: "Are you sure you want to delete this server?",
      showControls: true,
      onConfirm: () => {
        mutate(id);
        closeModal();
      },
    });
  };

  const onClickAddChannel = () => {
    showModal({
      title: "Create Channel",
      showControls: false,
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

      {channels.map((channel) => (
        <div
          key={channel.id}
          className={`h-12 bg-secondary-dark flex items-center cursor-pointer justify-between ${getCurrentChannelStyle(
            channel.id
          )}`}
          onClick={() => onClickChannels(channel.id)}
        >
          {channel.name}
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
      ))}
    </div>
  );
};

export default memo(ChannelSideBar);
