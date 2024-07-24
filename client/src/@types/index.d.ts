enum ChannelType {
  TEXT = "TEXT",
  VOICE = "VOICE",
}

export interface Channel {
  id: number;
  name: string;
  type: ChannelType;
  ownerId: number;
  protected: boolean;
  serverId: number;
  lastMessageId: number | null;
}

export interface ChannelResponse extends Channel {
  lastSeenMessageId: number | null;
}

export interface Server {
  id: number;
  name: string;
  ownerId: number;
  created_at: string;
  inviteCode: string;
  channels: ChannelResponse[];
}

export type ServerResponse = Pick<
  Server,
  "id" | "name" | "ownerId" | "channels" | "inviteCode"
>;

export type getAllUserServersWithChannelsResponse = ServerResponse[];

interface Message {
  id: number;
  content: string;
  channelId: number;
  authorId: number;
  createdAt: string;
  isTemp?: boolean;
}

interface MessageWithAuthor extends Message {
  author: {
    id: number;
    username: string;
  };
}

interface CreateMessageResponse extends Omit<MessageWithAuthor, "isTemp"> {
  tempId: number;
}

// fetchMessages 함수의 응답 타입 정의
export interface getAllMessagesResponse {
  messages: MessageWithAuthor[];
  nextCursor: number | null;
}
