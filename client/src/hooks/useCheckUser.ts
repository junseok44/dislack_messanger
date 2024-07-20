import { API_ROUTE } from "@/constants/routeName";
import { api, ApiError } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import React from "react";

const useCheckUser = () => {
  return useMutation<{
    data: {
      user: {
        username: string;
        id: number;
        planId: number;
      };
    };
  }>({
    mutationFn: async () => {
      console.log("useCheckUser");

      await new Promise((resolve) => setTimeout(resolve, 200));

      return api.get(API_ROUTE.AUTH.CHECK, {});
    },
  });
};

export default useCheckUser;
