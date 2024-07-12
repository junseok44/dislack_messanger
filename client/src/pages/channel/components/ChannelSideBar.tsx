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
  server: Pick<Server, "id" | "name">;
  onClickChannels: (channelId: number) => void;
}) => {
  const { mutate } = useDeleteServer();

  const {
    showModal: showDeleteServerModal,
    closeModal: closeDeleteServerModal,
  } = useModal();

  const onClickDeleteServer = (id: number) => {
    showDeleteServerModal(
      "서버 삭제",
      "정말로 서버를 삭제하시겠습니까?\n모든 데이터가 다 날아갑니다!!",
      () => {
        mutate(id);
        closeDeleteServerModal();
      }
    );
  };

  return (
    <div className="w-60 bg-secondary-dark h-full">
      <div>
        <div>{server.name}</div>
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
