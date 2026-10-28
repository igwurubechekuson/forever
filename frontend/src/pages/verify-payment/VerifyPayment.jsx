/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { AppContext } from "../../context/AppContext";

const VerifyPayment = () => {
  const [searchParams] = useSearchParams();
  const { navigate, backendUrl, token, setCartItems, getUserCart } =
    useContext(AppContext);

  const [statusText, setStatusText] = useState("Verifying payment...");
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const verifyPayment = async () => {
      const reference = searchParams.get("reference");
      const activeToken = token || localStorage.getItem("token");

      if (!reference) {
        toast.error("Payment reference not found");
        navigate("/cart");
        return;
      }

      if (!activeToken) {
        toast.error("Please login first");
        navigate("/login");
        return;
      }

      try {
        setStatusText("Verifying payment...");

        await new Promise((resolve) => setTimeout(resolve, 3000));

        const { data } = await axios.post(
          `${backendUrl}/api/v1/order/verify-paystack`,
          { reference },
          {
            headers: { token: activeToken },
          }
        );

        if (!isMounted) return;

        if (data.success) {
          setStatusText("Payment verified successfully");

          setCartItems({});
          await getUserCart(activeToken);

          toast.success("Payment verified successfully");

          setTimeout(() => {
            navigate("/orders");
          }, 1000);
        } else {
          setStatusText("Payment verification failed");
          toast.error(data.message || "Payment verification failed");

          setTimeout(() => {
            navigate("/cart");
          }, 1000);
        }
      } catch (error) {
        if (!isMounted) return;

        console.error("Verify payment error:", error);
        setStatusText("Payment verification failed");
        toast.error(error.response?.data?.message || error.message);

        setTimeout(() => {
          navigate("/cart");
        }, 1000);
      } finally {
        if (isMounted) {
          setIsVerifying(false);
        }
      }
    };

    verifyPayment();

    return () => {
      isMounted = false;
    };
  }, [searchParams, backendUrl, token, navigate, setCartItems, getUserCart]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
          <div className="absolute inset-0 rounded-full border-4 border-black border-t-transparent animate-spin" />
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
            Processing Payment
          </h2>
          <p className="text-sm sm:text-base text-gray-500 mt-2">
            {statusText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyPayment;