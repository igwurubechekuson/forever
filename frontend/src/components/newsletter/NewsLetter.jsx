import { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { AppContext } from "../../context/AppContext";



const NewsLetter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { backendUrl } = useContext(AppContext);

  // keep your validation
  const validateEmail = (value) => {
    return /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(value);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    const trimmedEmail = email.trim();

    // ===== VALIDATION (same flow) =====
    if (!trimmedEmail) {
      toast.error("Email address is required");
      return;
    }

    if (trimmedEmail.length > 254) {
      toast.error("Email is too long");
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.post(
        `${backendUrl}/api/v1/newsletter/subscribe`,
        { email: trimmedEmail }
      );

      if (data.success) {
        toast.success(data.message || "Subscribed successfully!");
        setEmail("");
      } else {
        toast.error(data.message || "Subscription failed");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center py-16 px-4 bg-gray-50">
      <p className="text-2xl sm:text-3xl font-semibold text-gray-800">
        Subscribe Now & Get 20% Off
      </p>

      <p className="mt-3 text-gray-500 max-w-xl mx-auto text-sm sm:text-base">
        Be the first to know about new arrivals, exclusive offers, and special discounts.
      </p>

      <form
        onSubmit={onSubmitHandler}
        className="w-full sm:w-1/2 mx-auto my-6"
      >
        <div className="flex items-center gap-3 pl-3 border border-gray-300 focus-within:border-black transition-all">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="w-full sm:flex-1 outline-none py-3"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white text-xs px-10 py-4 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <>
                {/* Spinner */}
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Subscribing...
              </>
            ) : (
              "SUBSCRIBE"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewsLetter;