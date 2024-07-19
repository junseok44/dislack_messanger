import React from "react";
import { useSearchParams } from "react-router-dom";
import { useFetchCheckoutSession } from "./useFetchCheckoutSession";

const CheckoutPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id") ?? "";

  const {
    data: session,
    error,
    isLoading,
  } = useFetchCheckoutSession(sessionId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!session) {
    return <div>Error: Could not retrieve session</div>;
  }

  return (
    <div>
      <h1>Payment Successful!</h1>
      <p>Thank you for your purchase.</p>
      <p>Session ID: {session.id}</p>
      <p>
        Amount: {session.amount_total / 100} {session.currency.toUpperCase()}
      </p>
      <button onClick={() => window.location.replace("/")}>Back to Home</button>
    </div>
  );
};

export default CheckoutPage;
