import { CHANNEL_MESSAGE_LIMIT } from "@/constants";
import { API_ROUTE } from "@/constants/routeName";
import { api } from "@/lib/api";

export const createChannel = async (name: string, serverId: number) => {
  await api.post(API_ROUTE.CHANNEL.CREATE, { name, serverId });
};

export const deleteChannel = async (id: number) => {
  await api.delete(API_ROUTE.CHANNEL.DELETE(id));
};

export const fetchMessages = async (
  channelId: number,
  cursor: number | null
) => {
  return api.get(API_ROUTE.MESSAGES.GET(channelId), {
    params: { cursor, limit: CHANNEL_MESSAGE_LIMIT },
  });
};

export const sendMessage = async ({
  channelId,
  content,
  tempId,
}: {
  channelId: number;
  content: string;
  tempId: number;
}) => {
  return api.post(API_ROUTE.MESSAGES.POST(channelId), {
    content,
    tempId,
  });
};
