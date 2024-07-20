import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useFetchCheckoutSession } from "./useFetchCheckoutSession";
import useCheckUser from "@/hooks/useCheckUser";
import FullScreenCenter from "@/components/ui/FullScreenCenter";
import ErrorPage from "../@common/ErrorPage";

const CheckoutPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id") ?? "";

  const navigate = useNavigate();

  const { mutate } = useCheckUser();

  useEffect(() => {
    mutate();
  }, []);

  const {
    data: session,
    error,
    isLoading,
  } = useFetchCheckoutSession(sessionId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <ErrorPage errorText={"An error occurred"}></ErrorPage>;
  }

  if (!session) {
    return <ErrorPage errorText={"could not find session"}></ErrorPage>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="flex flex-col items-center bg-gray-800 text-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-lg mb-2">Thank you for your purchase.</p>
        {/* <p className="text-sm mb-2">Session ID: {session.id}</p> */}
        <p className="text-lg font-semibold mb-6">
          Amount: {session.amount_total / 100} {session.currency.toUpperCase()}
        </p>
        <button
          onClick={() => {
            navigate("/");
          }}
          className="bg-green-500 hover:bg-green-600 text-black font-semibold py-2 px-4 rounded"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
