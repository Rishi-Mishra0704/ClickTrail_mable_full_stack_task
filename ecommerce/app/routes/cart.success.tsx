import React, { useEffect, useState } from "react";
import PageLayout from "@/components/layout/page-layout";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const CartCheckoutSuccess = () => {
  const navigate = useNavigate();
  const [secondsLeft, setSecondsLeft] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    const timeout = setTimeout(() => {
      navigate("/");
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <PageLayout>
      <div className="flex flex-col items-center justify-center text-center py-20 px-4">
        <CheckCircle className="text-green-500 w-20 h-20 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Checkout Successful!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. You'll be redirected to the homepage shortly.
        </p>
        <p className="text-sm text-gray-500">
          Redirecting in {secondsLeft} second{secondsLeft !== 1 && "s"}...
        </p>
      </div>
    </PageLayout>
  );
};

export default CartCheckoutSuccess;
