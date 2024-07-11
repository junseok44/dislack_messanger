import { PAGE_LIMIT } from "@/constants";
import { API_ROUTE } from "@/constants/routeName";
import { api } from "@/lib/api";

export const fetchMessages = async (
  channelId: number,
  cursor: number | null
) => {
  return api.get(API_ROUTE.MESSAGES.GET(channelId), {
    params: { cursor, limit: PAGE_LIMIT },
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
