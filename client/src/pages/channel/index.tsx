import { PAGE_ROUTE } from "@/constants/routeName";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ChannelSideBar from "./components/ChannelSideBar";
import { useMessages, useSendMessage } from "./hooks";
import { useGetUserServersWithChannels } from "@/hooks/useUserServerWithChannels";
import useAutoScroll from "@/hooks/useAutoScroll";

const Channel = () => {
  const allServers = useGetUserServersWithChannels();
  const { serverId, channelId } = useParams<{
    serverId: string;
    channelId: string;
  }>();
  const navigate = useNavigate();

  const [messageContent, setMessageContent] = useState<string>("");

  const parsedChannelId = channelId ? parseInt(channelId) : undefined;

  const {
    data: messageData,
    hasNextPage,
    fetchNextPage,
  } = useMessages(parsedChannelId);

  const { mutate: sendMessage } = useSendMessage();

  const allMessages =
    messageData?.pages.flatMap((page) => page.messages).reverse() || [];

  const { endRef: listEndRef, scrollToBottom } = useAutoScroll<HTMLDivElement>([
    allMessages.length,
  ]);

  if (!serverId || !channelId) {
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
    ?.channels.find((channel) => channel.id === parseInt(channelId));

  if (!currentChannel) {
    return <div>channel not found...</div>;
  }

  const handleSendMessage = () => {
    if (messageContent.trim() === "") return;
    sendMessage({
      channelId: parsedChannelId!,
      content: messageContent,
      authorId: 1,
    });
    setMessageContent("");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSendMessage();
    scrollToBottom();
  };

  return (
    <div className="flex-grow h-full flex max-h-screen">
      <ChannelSideBar channels={channels} onClickChannels={onClickChannels} />
      <div className="flex-grow h-full bg-background-dark">
        <div className="flex flex-col h-full">
          <ul className="flex-grow overflow-auto">
            {allMessages?.map((message) => (
              <li key={message.id}>
                {message.content} {message.id}
              </li>
            ))}
            <div ref={listEndRef} />
          </ul>
          <form onSubmit={handleSubmit} className="h-12">
            <input
              type="text"
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              placeholder="Enter your message"
              className="text-black"
            />
            <button type="submit">Send Message</button>
            {hasNextPage && (
              <button onClick={() => fetchNextPage()}>Load More</button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Channel;
