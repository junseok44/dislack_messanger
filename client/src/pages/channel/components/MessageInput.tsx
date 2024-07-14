import React, { useState } from "react";
import { useSendMessage } from "../hooks";
import { useAuth } from "@/contexts/AuthContext";

const MessageInput = ({
  scrollToBottom,
  parsedChannelId,
}: {
  scrollToBottom: () => void;
  parsedChannelId: number | undefined;
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
    if (messageContent.trim() === "") return;
    sendMessage({
      channelId: parsedChannelId!,
      content: messageContent,
      tempId: Math.random(),
      authorId: user?.id!,
    });
    setMessageContent("");
  };

  return (
    <form onSubmit={handleSubmit} className="h-12">
      <input
        type="text"
        value={messageContent}
        onChange={(e) => setMessageContent(e.target.value)}
        placeholder="Enter your message"
        className="text-black"
      />
      <button type="submit">Send Message</button>
    </form>
  );
};

export default MessageInput;
