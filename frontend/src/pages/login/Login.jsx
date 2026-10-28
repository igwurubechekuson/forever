import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-hot-toast";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const {token, setToken, backendUrl, navigate } = useContext(AppContext);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      toast.error("Email is required");
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      toast.error("Please enter a valid email address");
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
      toast.error("Password is required");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onChangeHandler = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  useEffect(() => {
 if (token) {
  navigate("/")
 }
  }, [token, navigate])

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      const { data } = await axios.post(
        `${backendUrl}/api/v1/user/login`,
        formData
      );

      if (data.success) {
        setToken(data.token);
        localStorage.setItem("token", data.token);
        toast.success(data.message || "Login successful");
        navigate("/");
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const emailInputClass = `w-full rounded-xl border px-4 py-3 outline-none transition-all duration-300 bg-white ${
    errors.email
      ? "border-red-500 focus:ring-4 focus:ring-red-100"
      : "border-gray-300 focus:border-black focus:ring-4 focus:ring-gray-100"
  }`;

  const passwordInputClass = `w-full rounded-xl border px-4 py-3 pr-16 outline-none transition-all duration-300 bg-white ${
    errors.password
      ? "border-red-500 focus:ring-4 focus:ring-red-100"
      : "border-gray-300 focus:border-black focus:ring-4 focus:ring-gray-100"
  }`;

  return (
    <form
      onSubmit={onSubmitHandler}
      noValidate
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mt-10">
        <h1 className="prata-regular text-3xl text-gray-900">Login</h1>
        <hr className="border-none h-[2px] w-10 bg-gray-900 rounded-full" />
      </div>

      <p className="text-sm text-gray-500">
        Welcome back. Please sign in to continue.
      </p>

      <div className="w-full">
        <label
          htmlFor="login-email"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Email Address
        </label>
        <input
          id="login-email"
          name="email"
          type="email"
          value={formData.email}
          onChange={onChangeHandler}
          placeholder="Enter your email"
          className={emailInputClass}
        />
        {errors.email && (
          <p className="mt-2 text-sm text-red-500">{errors.email}</p>
        )}
      </div>

      <div className="w-full">
        <label
          htmlFor="login-password"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Password
        </label>

        <div className="relative">
          <input
            id="login-password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={onChangeHandler}
            placeholder="Enter your password"
            className={passwordInputClass}
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500 hover:text-black transition cursor-pointer"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {errors.password && (
          <p className="mt-2 text-sm text-red-500">{errors.password}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-black text-white py-3.5 font-medium transition hover:bg-gray-800 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
      >
        {isSubmitting ? "Logging in..." : "Login"}
      </button>

      <p className="text-sm text-center text-gray-600">
        Don&apos;t have an account?{" "}
        <Link to="/signup" className="font-semibold text-black hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  );
};

export default Login;