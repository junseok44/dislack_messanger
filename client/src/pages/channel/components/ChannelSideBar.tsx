import { memo } from "react";
import { Channel, Server } from "@/@types";
import { useModal } from "@/contexts/ModalContext";
import { useDeleteServer } from "@/hooks/server";

const ChannelSideBar = ({
  channels,
  server,
  onClickChannels,
}: {
  channels: Channel[];
  server: Pick<Server, "id" | "name" | "inviteCode">;
  onClickChannels: (channelId: number) => void;
}) => {
  const { mutate } = useDeleteServer();

  const { showModal, closeModal } = useModal();

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

  return (
    <div className="w-60 bg-secondary-dark h-full">
      <div>
        <div>{server.name}</div>
        <div>{server.inviteCode}</div>
      </div>
      <button
        onClick={() => {
          onClickDeleteServer(server.id);
        }}
      >
        서버 삭제
      </button>
      {channels.map((channel) => (
        <div
          key={channel.id}
          className="h-12 bg-secondary-dark flex items-center cursor-pointer"
          onClick={() => onClickChannels(channel.id)}
        >
          {channel.name}
        </div>
      ))}
    </div>
  );
};

export default memo(ChannelSideBar);
