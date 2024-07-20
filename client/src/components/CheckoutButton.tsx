import { PRODUCTS } from "@/constants/stripe";
import { useCreateCheckoutSession } from "@/hooks/useCreateCheckoutSession";

const CheckoutButton = () => {
  const { mutateAsync, isPending } = useCreateCheckoutSession();

  const handleCheckout = async () => {
    try {
      const { priceId, productId, planId } = {
        priceId: PRODUCTS[2].prices[0].priceId,
        productId: PRODUCTS[2].id,
        planId: PRODUCTS[2].id,
      };

      const { url } = await mutateAsync({ priceId, productId, planId });

      window.location.href = url;
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  };
  return (
    <button onClick={handleCheckout} disabled={isPending}>
      {isPending ? "Processing..." : "결제하기"}
    </button>
  );
};

export default CheckoutButton;
