import { useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { backendUrl } from "../../App"

const Login = ({setToken}) => {
  const navigate = useNavigate();


  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  const getPasswordChecks = (password) => {
    return {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
    };
  };

  const passwordChecks = useMemo(
    () => getPasswordChecks(formData.password),
    [formData.password]
  );

  const isPasswordValid =
    passwordChecks.minLength &&
    passwordChecks.hasUppercase &&
    passwordChecks.hasLowercase &&
    passwordChecks.hasNumber;

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!isPasswordValid) {
      newErrors.password =
        "Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter and 1 number";
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

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      const payload = {
        email: formData.email.trim(),
        password: formData.password,
      };

      const { data } = await axios.post(
        `${backendUrl}/api/v1/admin/login`,
        payload
      );

      if (data.success) {
         setToken(data.token)
        toast.success(data.message);
        navigate("/admin/add-product");
        return;
      }

      toast.error(data.message || "Login failed");
    } catch (error) {
      console.error("Login failed:", error);

      const message =
        error.response?.data?.message ||
        error.message ||
        "Unable to login. Please try again.";

      toast.error(message);
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
    formData.password.length === 0
      ? "border-gray-300 focus:border-black focus:ring-4 focus:ring-gray-100"
      : isPasswordValid
        ? "border-green-500 focus:ring-4 focus:ring-green-100"
        : "border-red-500 focus:ring-4 focus:ring-red-100"
  }`;

  const ruleClass = (passed) =>
    `text-sm transition-colors duration-300 ${
      passed ? "text-green-600" : "text-red-500"
    }`;

  return (
    <form
      onSubmit={onSubmitHandler}
      noValidate
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mt-10">
        <h1 className="prata-regular text-3xl text-gray-900">Admin Login</h1>
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

        <ul className="mt-3 space-y-1.5">
          <li className={ruleClass(passwordChecks.minLength)}>
            • Minimum 8 characters
          </li>
          <li className={ruleClass(passwordChecks.hasUppercase)}>
            • At least 1 uppercase letter
          </li>
          <li className={ruleClass(passwordChecks.hasLowercase)}>
            • At least 1 lowercase letter
          </li>
          <li className={ruleClass(passwordChecks.hasNumber)}>
            • At least 1 number
          </li>
        </ul>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-black text-white py-3.5 font-medium transition hover:bg-gray-800 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
      >
        {isSubmitting ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};

export default Login;