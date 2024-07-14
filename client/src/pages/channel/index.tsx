import { PAGE_ROUTE } from "@/constants/routeName";
import { useAuth } from "@/contexts/AuthContext";
import { useUserServersWithChannels } from "@/hooks/server";
import useAutoScroll from "@/hooks/useAutoScroll";
import { useNavigate, useParams } from "react-router-dom";
import ChannelSideBar from "./components/ChannelSideBar";
import MessageInput from "./components/MessageInput";
import MessageList from "./components/MessageList";
import { useChannelSocket } from "./hooks";

const Channel = () => {
  const { data: allServers } = useUserServersWithChannels();
  const { serverId, channelId } = useParams<{
    serverId: string;
    channelId: string;
  }>();
  const navigate = useNavigate();

  const parsedChannelId = channelId ? parseInt(channelId) : undefined;

  const { user } = useAuth();

  const { endRef: listEndRef, scrollToBottom } =
    useAutoScroll<HTMLDivElement>();

  useChannelSocket(channelId);

  if (!serverId || !parsedChannelId) {
    return <div>loading...</div>;
  }

  const currentServer = allServers?.find(
    (server) => server.id === parseInt(serverId)
  );

  if (!currentServer) {
    return <div>server not found...</div>;
  }

  const channels = currentServer.channels;

  const onClickChannels = (channelId: number) => {
    navigate(PAGE_ROUTE.GOTO_CHANNEL(currentServer.id, channelId));
  };

  const currentChannel = allServers
    ?.find((server) => server.id === parseInt(serverId))
    ?.channels.find((channel) => channel.id === parsedChannelId);

  if (!currentChannel) {
    return <div>channel not found...</div>;
  }

  return (
    <div className="flex-grow h-full flex max-h-screen">
      <ChannelSideBar
        channels={channels}
        server={currentServer}
        onClickChannels={onClickChannels}
        userId={user?.id}
      />
      <div className="flex-grow h-full bg-background-dark">
        <div className="flex flex-col h-full">
          <h1>{currentChannel.name} 채널입니다.</h1>
          <MessageList
            listEndRef={listEndRef}
            parsedChannelId={parsedChannelId}
          />
          <MessageInput
            scrollToBottom={scrollToBottom}
            parsedChannelId={parsedChannelId}
          />
        </div>
      </div>
    </div>
  );
};

export default Channel;
