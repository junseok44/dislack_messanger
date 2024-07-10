import { useNavigate, useParams } from "react-router-dom";
import ChannelSideBar from "./components/ChannelSideBar";
import { useGetUserServersWithChannels } from "./hooks";
import { PAGE_ROUTE } from "@/constants/routeName";

const Channel = () => {
  const data = useGetUserServersWithChannels();

  const { serverId, channelId } = useParams<{
    serverId: string;
    channelId: string;
  }>();

  const navigate = useNavigate();

  if (!serverId || !channelId) {
    return <div>Loading...</div>;
  }

  const currentServer = data?.find(
    (server) => server.id === parseInt(serverId)
  );

  if (!currentServer) {
    return <div>server not found...</div>;
  }

  const channels = currentServer.channels;

  const onClickChannels = (channelId: number) => {
    navigate(PAGE_ROUTE.GOTO_CHANNEL(currentServer.id, channelId));
  };

  const currentChannel = data
    ?.find((server) => server.id === parseInt(serverId))
    ?.channels.find((channel) => channel.id === parseInt(channelId));

  return (
    <div className="flex-grow h-full flex">
      <ChannelSideBar channels={channels} onClickChannels={onClickChannels} />
      <div className="flex-grow h-full bg-background-dark">
        {currentChannel ? currentChannel.name : "채널이 없어요"}
      </div>
    </div>
  );
};

export default Channel;
