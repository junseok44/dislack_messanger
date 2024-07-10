import { PAGE_ROUTE } from "@/constants/routeName";
import { useNavigate } from "react-router-dom";

const SidebarButton = ({
  icon,
  text,
  onClick,
}: {
  icon: string;
  text: string;
  onClick: () => void;
}) => {
  return (
    <div
      className="w-12 h-12 bg-secondary-dark rounded-full flex items-center justify-center cursor-pointer"
      onClick={onClick}
    >
      {text}
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

  return (
    <div className="w-[72px] bg-primary-dark h-full flex flex-col items-center gap-3 py-3">
      <SidebarButton
        icon="home"
        text="홈"
        onClick={onClickMyPage}
      ></SidebarButton>
      <SidebarButton
        icon="home"
        text="채널 1"
        onClick={() => onClickChannels(1, 1)}
      ></SidebarButton>
      <SidebarButton
        icon="home"
        text="채널 2"
        onClick={() => onClickChannels(1, 2)}
      ></SidebarButton>
    </div>
  );
};

export default Sidebar;
