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
  authorId,
}: {
  channelId: number;
  content: string;
  authorId: number;
}) => {
  return api.post(API_ROUTE.MESSAGES.POST(channelId), {
    content,
    authorId,
  });
};