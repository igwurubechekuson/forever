import { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-hot-toast";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { token, setToken, backendUrl, navigate } = useContext(AppContext);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  const getPasswordChecks = (password) => {
    return {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[@$!%*?&]/.test(password),
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
    passwordChecks.hasNumber &&
    passwordChecks.hasSpecialChar;

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      toast.error("Name is required");
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
      toast.error("Name must be at least 2 characters");
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      toast.error("Email is required");
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      toast.error("Please enter a valid email address");
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      toast.error("Password is required");
    } else if (!isPasswordValid) {
      newErrors.password =
        "Password must contain at least 8 characters, uppercase, lowercase, number, and special character";
      toast.error(
        "Password must contain at least 8 characters, uppercase, lowercase, number, and special character"
      );
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

      const { data } = await axios.post(
        `${backendUrl}/api/v1/user/register`,
        formData
      );

      if (data.success) {
        setToken(data.token);
        localStorage.setItem("token", data.token);
        toast.success(data.message || "User registered successfully");
        navigate("/");
        setFormData({
          name: "",
          email: "",
          password: "",
        });
      } else {
        toast.error(data.message || "Signup failed");
      }
    } catch (error) {
      console.error("Signup failed:", error);
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nameInputClass = `w-full rounded-xl border px-4 py-3 outline-none transition-all duration-300 bg-white ${
    errors.name
      ? "border-red-500 focus:ring-4 focus:ring-red-100"
      : "border-gray-300 focus:border-black focus:ring-4 focus:ring-gray-100"
  }`;

  const emailInputClass = `w-full rounded-xl border px-4 py-3 outline-none transition-all duration-300 bg-white ${
    errors.email
      ? "border-red-500 focus:ring-4 focus:ring-red-100"
      : "border-gray-300 focus:border-black focus:ring-4 focus:ring-gray-100"
  }`;

  const passwordInputClass = `w-full rounded-xl border px-4 py-3 pr-12 outline-none transition-all duration-300 bg-white ${
    formData.password.length === 0
      ? "border-gray-300 focus:border-black focus:ring-4 focus:ring-gray-100"
      : isPasswordValid
      ? "border-green-500 focus:ring-4 focus:ring-green-100"
      : "border-red-500 focus:ring-4 focus:ring-red-100"
  }`;

  const ruleClass = (passed) =>
    `text-xs transition-colors duration-300 ${
      passed ? "text-green-600" : "text-red-500"
    }`;

      useEffect(() => {
     if (token) {
      navigate("/")
     }
      }, [navigate, token])

  return (
    <form
      onSubmit={onSubmitHandler}
      noValidate
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mt-10">
        <h1 className="prata-regular text-3xl text-gray-900">Sign Up</h1>
        <hr className="border-none h-[2px] w-10 bg-gray-900 rounded-full" />
      </div>

      <p className="text-sm text-gray-500">
        Create your account to continue.
      </p>

      <div className="w-full">
        <label
          htmlFor="signup-name"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Full Name
        </label>
        <input
          id="signup-name"
          name="name"
          type="text"
          value={formData.name}
          onChange={onChangeHandler}
          placeholder="Enter your full name"
          className={nameInputClass}
        />
        {errors.name && (
          <p className="mt-2 text-sm text-red-500">{errors.name}</p>
        )}
      </div>

      <div className="w-full">
        <label
          htmlFor="signup-email"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Email Address
        </label>
        <input
          id="signup-email"
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
          htmlFor="signup-password"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Password
        </label>

        <div className="relative">
          <input
            id="signup-password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={onChangeHandler}
            placeholder="Create a password"
            className={passwordInputClass}
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-black cursor-pointer"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {errors.password && (
          <p className="mt-2 text-sm text-red-500">{errors.password}</p>
        )}

        <ul className="mt-3 space-y-1">
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
          <li className={ruleClass(passwordChecks.hasSpecialChar)}>
            • At least 1 special character
          </li>
        </ul>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-black text-white py-3.5 font-medium transition hover:bg-gray-800 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
      >
        {isSubmitting ? "Creating account..." : "Sign Up"}
      </button>

      <p className="mt-6 text-sm text-center text-gray-600">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-black hover:underline">
          Login
        </Link>
      </p>
    </form>
  );
};

export default Signup;