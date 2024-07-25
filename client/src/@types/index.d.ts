export interface User {
  username: string;
  id: number;
  planId: number;
  thumbnail?: string;
}

enum ChannelType {
  TEXT = "TEXT",
  VOICE = "VOICE",
}

// 클라이언트에서 사용하는 타입 정의.
export interface Channel {
  id: number;
  name: string;
  type: ChannelType;
  ownerId: number;
  protected: boolean;
  serverId: number;
  lastMessageId: number | null;
  channelParticipants: User[];
  lastSeenMessageId: number | null;
}

export interface Server {
  id: number;
  name: string;
  ownerId: number;
  inviteCode: string;
  channels: Channel[];
}

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
