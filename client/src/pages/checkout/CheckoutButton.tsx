import { PRODUCTS } from "@/constants/stripe";
import { useCreateCheckoutSession } from "@/hooks/useCreateCheckoutSession";

const CheckoutButton = ({
  priceId,
  productId,
  planId,
}: {
  priceId: string;
  productId: string;
  planId: number;
}) => {
  const { mutateAsync, isPending } = useCreateCheckoutSession();

  const handleCheckout = async () => {
    try {
      const { url } = await mutateAsync({ priceId, productId, planId });

      window.location.href = url;
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  };
  return (
    <button
      className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold"
      onClick={handleCheckout}
      disabled={isPending}
    >
      {isPending ? "Processing..." : "결제하기"}
    </button>
  );
};

export default CheckoutButton;
