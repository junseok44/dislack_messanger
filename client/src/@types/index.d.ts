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
  channels: Channel[];
}

export type getAllUserServersWithChannelsResponse = Pick<
  Server,
  "id" | "name" | "owner_id" | "channels"
>[];
