import { API_ROUTE } from "@/constants/routeName";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

interface CheckoutSessionData {
  sessionId: string;
  id: string;
  currency: string;
  amount_total: number;
}

export const useFetchCheckoutSession = (sessionId: string) => {
  return useQuery<CheckoutSessionData, Error>({
    queryKey: ["checkoutSession", sessionId],
    queryFn: async () => {
      return api.get(
        API_ROUTE.SUBSCRIPTION.CHECKOUT_SESSION_COMPLETE(sessionId),
        {}
      );
    },
    enabled: !!sessionId,
  });
};
