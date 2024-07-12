export interface Channel {
  id: number;
  name: string;
  ownerId: number;
  protected: boolean;
  serverId: number;
}

export interface Server {
  id: number;
  name: string;
  owner_id: number;
  created_at: string;
  inviteCode: string;
  channels: Channel[];
}

export type ServerResponse = Pick<
  Server,
  "id" | "name" | "owner_id" | "channels" | "inviteCode"
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
