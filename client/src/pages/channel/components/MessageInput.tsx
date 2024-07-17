import { useAuth } from "@/contexts/AuthContext";
import React, { useState } from "react";
import { useSendMessage } from "../hooks";

const MessageInput = ({
  scrollToBottom,
  parsedChannelId,
  parsedServerId,
}: {
  scrollToBottom: () => void;
  parsedChannelId: number | undefined;
  parsedServerId: number | undefined;
}) => {
  const [messageContent, setMessageContent] = useState<string>("");

  const { mutate: sendMessage } = useSendMessage();

  const { user } = useAuth();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSendMessage();
    scrollToBottom();
  };

  const handleSendMessage = () => {
    if (
      messageContent.trim() === "" ||
      !parsedChannelId ||
      !user?.id ||
      !parsedServerId
    )
      return;

    // serverId를 보내는 이유는, 해당 서버를 구독하고 있는 socket에게 신규메시지 발생을 알리기 위함.
    sendMessage({
      channelId: parsedChannelId!,
      content: messageContent,
      tempId: Math.random(),
      serverId: parsedServerId,
      authorId: user?.id!,
    });
    setMessageContent("");
  };

  return (
    <div className="h-16 flex flex-shrink-0">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          placeholder="Enter your message"
          className="text-black"
        />
        <button type="submit">Send Message</button>
      </form>
    </div>
  );
};

export default MessageInput;
