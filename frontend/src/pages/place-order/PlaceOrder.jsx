import { useContext, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Title from "../../components/title/Title";
import { AppContext } from "../../context/AppContext";

const PlaceOrder = () => {
  const {
    currency,
    delivery_fee,
    getCartAmount,
    navigate,
    backendUrl,
    token,
    setCartItems,
  } = useContext(AppContext);

  const [method, setMethod] = useState("cod");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});

  const subtotal = getCartAmount();
  const total = subtotal > 0 ? subtotal + delivery_fee : 0;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+?[0-9]{10,15}$/;
  const zipcodeRegex = /^[a-zA-Z0-9\s-]{3,10}$/;

  const validateField = (name, value) => {
    const trimmedValue = value.trim();

    switch (name) {
      case "firstName":
        if (!trimmedValue) return "First name is required";
        if (trimmedValue.length < 2) {
          return "First name must be at least 2 characters";
        }
        return "";

      case "lastName":
        if (!trimmedValue) return "Last name is required";
        if (trimmedValue.length < 2) {
          return "Last name must be at least 2 characters";
        }
        return "";

      case "email":
        if (!trimmedValue) return "Email address is required";
        if (!emailRegex.test(trimmedValue)) {
          return "Enter a valid email address";
        }
        return "";

      case "street":
        if (!trimmedValue) return "Street address is required";
        if (trimmedValue.length < 5) return "Street address is too short";
        return "";

      case "city":
        if (!trimmedValue) return "City is required";
        return "";

      case "state":
        if (!trimmedValue) return "State is required";
        return "";

      case "zipcode":
        if (!trimmedValue) return "Zip code is required";
        if (!zipcodeRegex.test(trimmedValue)) return "Enter a valid zip code";
        return "";

      case "country":
        if (!trimmedValue) return "Country is required";
        return "";

      case "phone":
        if (!trimmedValue) return "Phone number is required";
        if (!phoneRegex.test(trimmedValue.replace(/\s+/g, ""))) {
          return "Enter a valid phone number";
        }
        return "";

      default:
        return "";
    }
  };

  const validateForm = () => {
    const newErrors = {};

    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = useMemo(() => {
    return (
      Object.values(formData).every((value) => value.trim() !== "") &&
      Object.keys(formData).every((key) => !validateField(key, formData[key]))
    );
  }, [formData]);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (subtotal <= 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (!token) {
      toast.error("Please login to place an order");
      navigate("/login");
      return;
    }

    const isValid = validateForm();
    if (!isValid) return;

    try {
      setLoading(true);

      const payload = {
        address: formData,
      };

      if (method === "cod") {
        const { data } = await axios.post(
          `${backendUrl}/api/v1/order/cod`,
          payload,
          {
            headers: { token },
          }
        );

        if (data.success) {
          setCartItems({});
          toast.success("Order placed successfully");
          navigate("/orders");
        } else {
          toast.error(data.message || "Unable to place order");
        }
      } else {
        const { data } = await axios.post(
          `${backendUrl}/api/v1/order/paystack`,
          payload,
          {
            headers: { token },
          }
        );

        if (data.success && data.authorization_url) {
          window.location.href = data.authorization_url;
        } else {
          toast.error(data.message || "Unable to initialize payment");
        }
      }
    } catch (error) {
      console.error("Place order error:", error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (fieldName) =>
    `border rounded-sm py-3 px-4 w-full outline-none transition ${
      errors[fieldName]
        ? "border-red-500 focus:border-red-500"
        : "border-gray-300 focus:border-black"
    }`;

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col lg:flex-row justify-between gap-10 pt-10 min-h-[80vh] border-t"
    >
      <div className="flex flex-col gap-4 w-full lg:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1="DELIVERY" text2="INFORMATION" />
        </div>

        <div className="flex gap-3 flex-col sm:flex-row">
          <div className="w-full">
            <input
              onChange={onChangeHandler}
              name="firstName"
              value={formData.firstName}
              className={inputClass("firstName")}
              type="text"
              placeholder="First name"
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
            )}
          </div>

          <div className="w-full">
            <input
              onChange={onChangeHandler}
              name="lastName"
              value={formData.lastName}
              className={inputClass("lastName")}
              type="text"
              placeholder="Last name"
            />
            {errors.lastName && (
              <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>

        <div>
          <input
            onChange={onChangeHandler}
            name="email"
            value={formData.email}
            className={inputClass("email")}
            type="email"
            placeholder="Email address"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <input
            onChange={onChangeHandler}
            name="street"
            value={formData.street}
            className={inputClass("street")}
            type="text"
            placeholder="Street address"
          />
          {errors.street && (
            <p className="text-red-500 text-xs mt-1">{errors.street}</p>
          )}
        </div>

        <div className="flex gap-3 flex-col sm:flex-row">
          <div className="w-full">
            <input
              onChange={onChangeHandler}
              name="city"
              value={formData.city}
              className={inputClass("city")}
              type="text"
              placeholder="City"
            />
            {errors.city && (
              <p className="text-red-500 text-xs mt-1">{errors.city}</p>
            )}
          </div>

          <div className="w-full">
            <input
              onChange={onChangeHandler}
              name="state"
              value={formData.state}
              className={inputClass("state")}
              type="text"
              placeholder="State"
            />
            {errors.state && (
              <p className="text-red-500 text-xs mt-1">{errors.state}</p>
            )}
          </div>
        </div>

        <div className="flex gap-3 flex-col sm:flex-row">
          <div className="w-full">
            <input
              onChange={onChangeHandler}
              name="zipcode"
              value={formData.zipcode}
              className={inputClass("zipcode")}
              type="text"
              placeholder="Zip code"
            />
            {errors.zipcode && (
              <p className="text-red-500 text-xs mt-1">{errors.zipcode}</p>
            )}
          </div>

          <div className="w-full">
            <input
              onChange={onChangeHandler}
              name="country"
              value={formData.country}
              className={inputClass("country")}
              type="text"
              placeholder="Country"
            />
            {errors.country && (
              <p className="text-red-500 text-xs mt-1">{errors.country}</p>
            )}
          </div>
        </div>

        <div>
          <input
            onChange={onChangeHandler}
            name="phone"
            value={formData.phone}
            className={inputClass("phone")}
            type="tel"
            placeholder="Phone number"
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
          )}
        </div>
      </div>

      <div className="mt-8 min-w-full lg:min-w-[420px]">
        <div className="mb-8">
          <div className="text-xl sm:text-2xl mb-5">
            <Title text1="CART" text2="TOTALS" />
          </div>

          <div className="border rounded-sm p-6 bg-gray-50">
            <div className="flex flex-col gap-4 text-sm">
              <div className="flex justify-between">
                <p className="text-gray-600">Subtotal</p>
                <p className="font-medium">
                  {currency}
                  {subtotal.toLocaleString()}
                </p>
              </div>

              <hr />

              <div className="flex justify-between">
                <p className="text-gray-600">Delivery Fee</p>
                <p className="font-medium">
                  {currency}
                  {(subtotal > 0 ? delivery_fee : 0).toLocaleString()}
                </p>
              </div>

              <hr />

              <div className="flex justify-between text-base">
                <p className="font-semibold">Total</p>
                <p className="font-semibold">
                  {currency}
                  {total.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="text-xl sm:text-2xl mb-5">
            <Title text1="PAYMENT" text2="METHOD" />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => setMethod("paystack")}
              className={`flex items-center justify-center gap-3 border p-4 rounded-sm transition w-full cursor-pointer ${
                method === "paystack"
                  ? "border-black bg-gray-50"
                  : "border-gray-300"
              }`}
            >
              <div
                className={`min-w-4 h-4 border rounded-full ${
                  method === "paystack" ? "bg-green-500" : ""
                }`}
              />
              <p className="text-sm font-medium text-gray-700">PAYSTACK</p>
            </button>

            <button
              type="button"
              onClick={() => setMethod("cod")}
              className={`flex items-center justify-center gap-3 border p-4 rounded-sm transition w-full cursor-pointer ${
                method === "cod" ? "border-black bg-gray-50" : "border-gray-300"
              }`}
            >
              <div
                className={`min-w-4 h-4 border rounded-full ${
                  method === "cod" ? "bg-green-500" : ""
                }`}
              />
              <p className="text-sm font-medium text-gray-700">
                CASH ON DELIVERY
              </p>
            </button>
          </div>

          <div className="w-full text-end mt-8">
            <button
              type="submit"
              disabled={!isFormValid || subtotal <= 0 || loading}
              className="bg-black text-white px-10 py-3 text-sm rounded-sm cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading
                ? method === "cod"
                  ? "PLACING ORDER..."
                  : "REDIRECTING..."
                : "PLACE ORDER"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;