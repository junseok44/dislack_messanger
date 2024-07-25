import { ChannelType } from "@/@types/channel";
import { PAGE_ROUTE } from "@/constants/routeName";
import { useAuth } from "@/contexts/AuthContext";
import useAutoScroll from "@/hooks/useAutoScroll";
import useModal from "@/hooks/useModal";
import useToast from "@/hooks/useToast";
import useMediaChatStore from "@/store/mediaStore";
import { useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoadingPage from "../@common/LoadingPage";
import ChannelSideBar from "./components/ChannelSideBar";
import MediaChat from "./components/MediaChat";
import MessageInput from "./components/MessageInput";
import MessageList from "./components/MessageList";
import { useChannelSocket } from "./hooks";
import { useUserServersWithChannels } from "@/hooks/server";

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

  const { showModalWithControls, closeModal } = useModal();

  const { mediaRoomId, setGlobalMode, setMediaRoomId } = useMediaChatStore();

  // 현재 채널이 존재하는지 확인.
  // 이 작업도 지금 매번 렌더링될때마다 하고 있다.
  // 차이는 지금 채널에서의 변경만 반영하느냐 아니면 전체 서버에서의 변경을 반영하느냐의 차이.
  useEffect(() => {
    if (!parsedServerId || !parsedChannelId) {
      navigate(PAGE_ROUTE.HOME);
      return;
    }

    if (allServers) {
      const server = allServers.find((server) => server.id === parsedServerId);

      if (!server) {
        showToast({
          message: "해당 서버를 찾을 수 없습니다.",
          type: "error",
        });
        navigate(PAGE_ROUTE.HOME);
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
        if (mediaRoomId === parsedChannelId) {
          setMediaRoomId(null);
          setGlobalMode(true);
        }
        if (server.channels.length > 0) {
          navigate(PAGE_ROUTE.GOTO_CHANNEL(server.id, server.channels[0].id));
          return;
        }
        // 만약 어떤 오류로 인해 해당 서버에 채널이 하나도 없다면, 서버로 리다이렉트.
        navigate(PAGE_ROUTE.HOME);
      }
    }
  }, [allServers, parsedServerId, parsedChannelId, navigate]);

  const currentServer = allServers?.find(
    (server) => server.id === parseInt(serverId || "")
  );

  const channels = currentServer?.channels;

  const currentChannel = channels?.find(
    (channel) => channel.id === parsedChannelId
  );

  const onClickChannels = useCallback(
    (channelId: number, channelType: ChannelType) => {
      if (!currentServer) return;

      if (channelType === ChannelType.TEXT) {
        navigate(PAGE_ROUTE.GOTO_CHANNEL(currentServer.id, channelId));
        return;
      }

      if (mediaRoomId) {
        if (mediaRoomId !== channelId) {
          showModalWithControls({
            title: "이미 다른 음성 채팅방에 들어와있어요",
            text: "채팅방을 변경하면 기존 채팅방에서 나가게 됩니다. 계속 진행하시겠어요?",
            onConfirm: () => {
              setMediaRoomId(channelId);
              closeModal();
            },
          });
        } else {
          navigate(PAGE_ROUTE.GOTO_CHANNEL(currentServer.id, channelId));
        }
      } else {
        setMediaRoomId(channelId);
      }
    },
    [navigate, currentServer, mediaRoomId]
  );

  if (!allServers || !currentServer || !currentChannel || !channels) {
    return <LoadingPage loadingText="Loading Server" />;
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
          {currentChannel.type == ChannelType.VOICE ? (
            <MediaChat currentChannelId={currentChannel.id} />
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Channel;
