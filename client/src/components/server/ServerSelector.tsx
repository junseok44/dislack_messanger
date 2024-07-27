import { PAGE_ROUTE } from "@/constants/routeName";
import { useLocation, useNavigate } from "react-router-dom";
import CreateServerForm from "./CreateServerForm";
import InviteServerForm from "./InviteServerForm";
import useModal from "@/hooks/useModal";
import { hasNewMessageOnChannel } from "@/utils/hasNewMessageOnChannel";
import { useAuth } from "@/contexts/AuthContext";
import { useUserServersWithChannels } from "@/hooks/server";
import { Server } from "@/@types";
import React from "react";
import { LogOut, Mail, Plus, ShoppingCart } from "lucide-react";

const SidebarButton = ({
  icon,
  text,
  onClick,
  isNewMessage,
  serverId,
}: {
  icon?: React.ReactNode;
  text: string;
  onClick: () => void;
  serverId?: number;
  isNewMessage?: boolean;
}) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const isSelected =
    (serverId && currentPath.includes(`/channels/${serverId}`)) ||
    (currentPath.includes("/channels/@me") && text === "홈");

  return (
    <div className="flex items-center justify-center gap-1 relative">
      {isNewMessage ? (
        <div className="w-2 h-2 rounded-full bg-secondary-light absolute left-0"></div>
      ) : null}
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer overflow-hidden ${
          isSelected ? "border-2 border-secondary-light" : "bg-secondary-dark"
        }`}
        onClick={onClick}
      >
        {icon ? (
          icon
        ) : (
          <p className="text-sm text-center text-nowrap">{text}</p>
        )}
      </div>
    </div>
  );
};

const Sidebar = () => {
  const navigate = useNavigate();

  const onClickChannels = (server: number, channel: number) => {
    navigate(PAGE_ROUTE.GOTO_CHANNEL(server, channel));
  };

  const { data } = useUserServersWithChannels();

  const { logout } = useAuth();

  const { showModalWithoutControls } = useModal();

  const openCreateServerModal = () => {
    showModalWithoutControls({
      title: "서버 만들기",
      text: "",
      children: <CreateServerForm />,
    });
  };

  const openInviteServerModal = () => {
    showModalWithoutControls({
      title: "서버 들어가기",
      text: "",
      children: <InviteServerForm />,
    });
  };

  const hasServerNewMessage = (server: Server) => {
    return server.channels.some((channel) =>
      hasNewMessageOnChannel(channel.lastMessageId, channel.lastSeenMessageId)
    );
  };

  return (
    <div className="w-[72px] bg-primary-dark h-full flex flex-col gap-3 py-3 flex-shrink-0">
      {/* <SidebarButton
        icon="home"
        text="홈"
        onClick={onClickMyPage}
      ></SidebarButton> */}

      {data?.map((server) => {
        const hasNewMessage = hasServerNewMessage(server);

        return (
          <SidebarButton
            key={server.id}
            text={server.name}
            isNewMessage={hasNewMessage}
            serverId={server.id}
            onClick={() => onClickChannels(server.id, server.channels[0].id)}
          ></SidebarButton>
        );
      })}

      <SidebarButton
        icon={<Plus size={24} />}
        text="추가"
        onClick={openCreateServerModal}
      ></SidebarButton>
      <SidebarButton
        icon={<Mail size={24} />}
        text="초대"
        onClick={openInviteServerModal}
      ></SidebarButton>
      <SidebarButton
        icon={<ShoppingCart size={24} />}
        text="상품"
        onClick={() => {
          navigate(PAGE_ROUTE.PRODUCTS);
        }}
      ></SidebarButton>
      <SidebarButton
        icon={<LogOut size={24} className="text-danger-light" />}
        text="로그아웃"
        onClick={() => logout()}
      ></SidebarButton>
    </div>
  );
};

export default Sidebar;
