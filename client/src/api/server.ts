import { API_ROUTE } from "@/constants/routeName";
import { api } from "@/lib/api";

export const createServer = async (name: string) => {
  return await api.post(API_ROUTE.SERVER.CREATE, { name });
};

export const deleteServer = async (id: number) => {
  return await api.delete(API_ROUTE.SERVER.DELETE(id));
};
