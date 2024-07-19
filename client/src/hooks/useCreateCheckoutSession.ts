import { API_ROUTE } from "@/constants/routeName";
import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import useToast from "./useToast";

interface CheckoutSessionData {
  priceId: string;
  productId: number;
}

export const useCreateCheckoutSession = () => {
  const { showToast } = useToast();

  return useMutation<{ url: string }, Error, CheckoutSessionData>({
    mutationFn: async (data) => {
      return api.post(API_ROUTE.SUBSCRIPTION.CHECKOUT_SESSION, data);
    },
    onMutate: () => {
      showToast({
        message: "결제 페이지로 이동합니다.",
        type: "info",
      });
    },
    onError: (error) => {
      showToast({
        message: error.message,
        type: "error",
      });
    },
  });
};
