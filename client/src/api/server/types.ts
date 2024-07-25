import { Channel, Server } from "../../@types";

// channelParticipants는 클라이언트에서 넣어주는거임.
export interface ChannelResponse extends Omit<Channel, "channelParticipants"> {}

export interface ServerResponse extends Omit<Server, "channels"> {
  channels: ChannelResponse[];
}
export type getAllUserServersWithChannelsResponse = ServerResponse[];
