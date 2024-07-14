import { PAGE_ROUTE } from "@/constants/routeName";
import {
  useGetUserServersWithChannels,
  useUserServersWithChannels,
} from "@/hooks/server";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CreateServerModal from "./CreateServerModal";
import { useModal } from "@/contexts/ModalContext";
import InviteServerForm from "./InviteServerModal";
import CreateServerForm from "./CreateServerModal";

const SidebarButton = ({
  icon,
  text,
  onClick,
  serverId,
}: {
  icon: string;
  text: string;
  onClick: () => void;
  serverId?: number;
}) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const isSelected =
    (serverId && currentPath.includes(`/channels/${serverId}`)) ||
    (currentPath.includes("/channels/@me") && text === "홈");

  return (
    <div
      className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer overflow-hidden ${
        isSelected ? "border-2 border-secondary-light" : "bg-secondary-dark"
      }`}
      onClick={onClick}
    >
      <p className="text-sm text-center text-nowrap">{text}</p>
    </div>
  );
};

const Sidebar = () => {
  const navigate = useNavigate();

  const onClickMyPage = () => {
    navigate(PAGE_ROUTE.CHANNELS_ME);
  };

  const onClickChannels = (server: number, channel: number) => {
    navigate(PAGE_ROUTE.GOTO_CHANNEL(server, channel));
  };

  const { data } = useUserServersWithChannels();

  const { showModal } = useModal();

  const openCreateServerModal = () => {
    showModal({
      title: "서버 만들기",
      text: "",
      children: <CreateServerForm />,
    });
  };

  const openInviteServerModal = () => {
    showModal({
      title: "초대코드 입력",
      text: "",
      children: <InviteServerForm />,
    });
  };

  return (
    <div className="w-[72px] bg-primary-dark h-full flex flex-col items-center gap-3 py-3">
      <SidebarButton
        icon="home"
        text="홈"
        onClick={onClickMyPage}
      ></SidebarButton>

      {data?.map((server) => (
        <SidebarButton
          key={server.id}
          icon="home"
          text={server.name}
          serverId={server.id}
          onClick={() => onClickChannels(server.id, server.channels[0].id)}
        ></SidebarButton>
      ))}

      <SidebarButton
        icon="home"
        text="추가"
        onClick={openCreateServerModal}
      ></SidebarButton>
      <SidebarButton
        icon="home"
        text="초대"
        onClick={openInviteServerModal}
      ></SidebarButton>
    </div>
  );
};

export default Sidebar;
