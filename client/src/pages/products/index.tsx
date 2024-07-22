import FullScreenCenter from "@/components/ui/FullScreenCenter";
import { PRODUCTS } from "@/constants/stripe";
import useCheckUser from "@/hooks/useCheckUser";
import LoadingPage from "../@common/LoadingPage";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CheckoutButton from "../checkout/CheckoutButton";

const ProductsPage = () => {
  const { data: response, error, mutate } = useCheckUser();

  const navigate = useNavigate();

  useEffect(() => {
    mutate();
  }, []);

  const user = response?.data?.user;

  if (!user) {
    return <LoadingPage />;
  }

  const getPlanDescription = (planId: number) => {
    switch (planId) {
      case 0:
        return "무료 플랜입니다.";
      case 1:
        return "조금 비쌈";
      case 2:
        return "존나 비쌈";
      default:
        return "Free";
    }
  };

  console.log(user.planId);

  return (
    <div className="bg-black text-white min-h-screen">
      <FullScreenCenter>
        <div className="flex flex-col items-center mb-10">
          <h1 className="text-5xl font-bold mb-6">Pricing plans</h1>
          <p className="mb-10 text-gray-400">
            Our pricing plans are designed to be affordable, flexible, and
            tailored to your unique needs.
          </p>
          <div className="flex space-x-6">
            {PRODUCTS.map((product) => (
              <div
                key={product.id}
                className="bg-gray-800 rounded-lg shadow-lg p-6 w-80"
              >
                <h2 className="text-2xl font-semibold mb-4">{product.name}</h2>
                <p className="text-4xl font-bold mb-4">
                  $
                  {product.prices.length > 0
                    ? product.prices[0].amount
                    : "Free"}{" "}
                  <span className="text-lg font-medium">/ Per Month</span>
                </p>
                <ul className="mb-6">
                  <li className="flex items-center mb-2">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    최대 {product.servers}개의 서버 생성가능
                  </li>
                  <li className="flex items-center mb-2">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    {getPlanDescription(product.id)}
                  </li>
                </ul>
                {product.id == 0 ? (
                  <button className="py-2 px-4 rounded-lg font-semibold border-white border-2">
                    기본 플랜
                  </button>
                ) : user.planId === product.id ? (
                  <button className="bg-green-500 text-black px-4 py-2 rounded-lg font-semibold">
                    Subscribed!
                  </button>
                ) : (
                  <CheckoutButton
                    priceId={product.prices[0].priceId}
                    productId={product.productId}
                    planId={user.planId}
                  />
                )}
              </div>
            ))}
          </div>
          <button
            className="py-2 px-4 rounded-lg font-semibold border-white border-2 mt-20"
            onClick={() => {
              navigate(-1);
            }}
          >
            돌아가기
          </button>
        </div>
      </FullScreenCenter>
    </div>
  );
};

export default ProductsPage;
