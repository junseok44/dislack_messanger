// components/CheckoutPage.tsx
import { PRODUCTS } from "@/constants/stripe";
import { useCreateCheckoutSession } from "@/hooks/useCreateCheckoutSession";

const MyPage = () => {
  const { mutateAsync } = useCreateCheckoutSession();

  const handleCheckout = async () => {
    try {
      const { priceId, productId } = {
        priceId: PRODUCTS[2].prices[0].priceId,
        productId: PRODUCTS[2].id,
      };

      const { url } = await mutateAsync({ priceId, productId });

      window.location.href = url;
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  };

  return <button onClick={handleCheckout}>결제하기</button>;
};

export default MyPage;
