import { getAllUserServersWithChannelsResponse } from "@/@types";
import { API_ROUTE, PAGE_ROUTE } from "@/constants/routeName";
import { useQueryClient } from "@tanstack/react-query";
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
      className="w-12 h-12 bg-secondary-dark rounded-full flex items-center justify-center cursor-pointer overflow-hidden"
      onClick={onClick}
    >
      <p className="text-sm text-center">{text}</p>
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

  const queryClient = useQueryClient();

  const data = queryClient.getQueryData<getAllUserServersWithChannelsResponse>([
    API_ROUTE.SERVER.GET_USER_SERVERS_WITH_CHANNELS,
  ]);

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
          onClick={() => onClickChannels(server.id, server.channels[0].id)}
        ></SidebarButton>
      ))}
    </div>
  );
};

export default Sidebar;
