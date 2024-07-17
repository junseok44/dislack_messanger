import { PAGE_ROUTE } from "@/constants/routeName";
import { useAuth } from "@/contexts/AuthContext";
import { useUserServersWithChannels } from "@/hooks/server";
import useAutoScroll from "@/hooks/useAutoScroll";
import { useNavigate, useParams } from "react-router-dom";
import ChannelSideBar from "./components/ChannelSideBar";
import MessageInput from "./components/MessageInput";
import MessageList from "./components/MessageList";
import { useChannelSocket } from "./hooks";
import { useEffect } from "react";
import useToast from "@/hooks/useToast";

const Channel = () => {
  const { data: allServers } = useUserServersWithChannels();

  const { serverId, channelId } = useParams<{
    serverId: string;
    channelId: string;
  }>();

  const navigate = useNavigate();

  const parsedChannelId = channelId ? parseInt(channelId) : undefined;
  const parsedServerId = serverId ? parseInt(serverId) : undefined;

  const { user } = useAuth();

  const { endRef: listEndRef, scrollToBottom } =
    useAutoScroll<HTMLDivElement>();

  useChannelSocket(channelId);

  const { showToast } = useToast();

  useEffect(() => {
    if (!parsedServerId || !parsedChannelId) {
      navigate(PAGE_ROUTE.CHANNELS_ME);
      return;
    }

    if (allServers) {
      const server = allServers.find((server) => server.id === parsedServerId);

      if (!server) {
        showToast({
          message: "해당 서버를 찾을 수 없습니다.",
          type: "error",
        });
        navigate(PAGE_ROUTE.CHANNELS_ME);
        return;
      }

      const channelExists = server.channels.some(
        (channel) => channel.id === parsedChannelId
      );

      if (!channelExists) {
        showToast({
          message: "해당 채널을 찾을 수 없습니다.",
          type: "error",
        });
        if (server.channels.length > 0) {
          navigate(PAGE_ROUTE.GOTO_CHANNEL(server.id, server.channels[0].id));
          return;
        }
        // 만약 어떤 오류로 인해 해당 서버에 채널이 하나도 없다면, 서버로 리다이렉트.
        navigate(PAGE_ROUTE.CHANNELS_ME);
      }
    }
  }, [allServers, parsedServerId, parsedChannelId, navigate]);

  if (!serverId || !parsedChannelId) {
    return <div>redirecting...</div>;
  }

  const currentServer = allServers?.find(
    (server) => server.id === parseInt(serverId)
  );

  if (!currentServer) {
    return <div>redirecting...</div>;
  }

  const channels = currentServer.channels;

  const onClickChannels = (channelId: number) => {
    navigate(PAGE_ROUTE.GOTO_CHANNEL(currentServer.id, channelId));
  };

  const currentChannel = channels.find(
    (channel) => channel.id === parsedChannelId
  );

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
      <div className="flex-grow h-full bg-background-dark flex flex-col">
        <div className="h-12 flex-shrink-0">
          {currentChannel ? (
            <h1 className="text-2xl text-white">#{currentChannel.name} 채널</h1>
          ) : (
            <h1 className="text-2xl text-white p-4">Channel not found</h1>
          )}
        </div>
        <div className="flex-grow flex flex-col overflow-auto">
          <MessageList
            listEndRef={listEndRef}
            parsedChannelId={parsedChannelId}
            channelName={
              currentChannel ? currentChannel.name : "Channel not found"
            }
            lastSeenMessageId={currentChannel?.lastSeenMessageId}
          />
          <MessageInput
            scrollToBottom={scrollToBottom}
            parsedChannelId={parsedChannelId}
            parsedServerId={currentServer.id}
          />
        </div>
      </div>
    </div>
  );
};

export default Channel;
