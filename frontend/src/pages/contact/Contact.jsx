import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import Title from "../../components/title/Title";
import { assets } from "../../assets/frontend_assets/assets";
import { AppContext } from "../../context/AppContext";


const Contact = () => {
  const { backendUrl } = useContext(AppContext)
  const location = useLocation();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    orderNumber: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (location.state?.subject) {
      setFormData((prev) => ({
        ...prev,
        subject: location.state.subject,
      }));
    }
  }, [location.state]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email.trim())
    ) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9+\s()-]{7,20}$/.test(formData.phone.trim())) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    } else if (formData.subject.trim().length < 3) {
      newErrors.subject = "Subject must be at least 3 characters";
    }

    if (formData.orderNumber.trim() && formData.orderNumber.trim().length < 4) {
      newErrors.orderNumber = "Order number looks too short";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    if (errors.submit) {
      setErrors((prev) => ({
        ...prev,
        submit: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    try {
      setIsSubmitting(true);

      const payload = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        subject: formData.subject.trim(),
        orderNumber: formData.orderNumber.trim(),
        message: formData.message.trim(),
      };

      const { data } = await axios.post(
        `${backendUrl}/api/v1/contact/submit`,
        payload
      );

      if (data.success) {
        toast.success(
          data.message ||
            "Your message has been sent successfully. Our team will get back to you shortly."
        );

        setFormData({
          fullName: "",
          email: "",
          phone: "",
          subject: location.state?.subject || "",
          orderNumber: "",
          message: "",
        });

        setErrors({});
      } else {
        toast.error(data.message || "Failed to send message");
      }
    } catch (error) {
      console.log(error);

      const backendErrors = error.response?.data?.errors;

      if (backendErrors && typeof backendErrors === "object") {
        setErrors(backendErrors);
      }

      const message =
        error.response?.data?.message ||
        "Something went wrong while sending your message. Please try again.";

      setErrors((prev) => ({
        ...prev,
        submit: message,
      }));

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (fieldName) =>
    `w-full rounded-lg border px-4 py-3 text-sm outline-none transition ${
      errors[fieldName]
        ? "border-red-500 focus:border-red-500"
        : "border-gray-300 focus:border-black"
    }`;

  return (
    <div className="px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24">
      <div className="text-2xl text-center pt-8 border-t">
        <Title text1="CONTACT" text2="US" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 my-10">
        <div className="flex flex-col gap-8">
          <img
            src={assets.contact_img}
            alt="Contact Forever"
            className="w-full rounded-xl object-cover shadow-sm"
          />

          <div className="border border-gray-200 rounded-xl p-6 flex flex-col gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Get in touch
              </h3>
              <p className="text-sm text-gray-600 mt-2 leading-6">
                We would love to hear from you. Whether you have questions about
                orders, returns, exchanges, product availability, or general
                support, send us a message and our team will assist you.
              </p>
            </div>

            <div className="flex flex-col gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <p>
                  <span className="font-semibold text-gray-800">Email:</span>{" "}
                  support@forever.com
                </p>
              </div>

              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 5a2 2 0 012-2h2l2 5-2 1a11 11 0 005 5l1-2 5 2v2a2 2 0 01-2 2h-1C9.716 20 4 14.284 4 7V6a2 2 0 012-2z"
                  />
                </svg>
                <p>
                  <span className="font-semibold text-gray-800">Phone:</span>{" "}
                  +234 800 000 0000
                </p>
              </div>

              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0L6.343 16.657A8 8 0 1117.657 16.657z"
                  />
                  <circle cx="12" cy="11" r="3" />
                </svg>
                <p>
                  <span className="font-semibold text-gray-800">Address:</span>{" "}
                  24 Fashion Avenue, Lagos, Nigeria
                </p>
              </div>

              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6l4 2"
                  />
                </svg>
                <p>
                  <span className="font-semibold text-gray-800">
                    Working Hours:
                  </span>{" "}
                  Monday - Saturday, 9:00 AM - 6:00 PM
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-2xl p-6 sm:p-8 bg-white shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Send us a message
            </h2>
            <p className="text-sm text-gray-600 mt-2 leading-6">
              Fill out the form below and we will get back to you as soon as
              possible.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
            noValidate
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={inputClass("fullName")}
              />
              {errors.fullName && (
                <p className="text-red-500 text-xs mt-2">{errors.fullName}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={inputClass("email")}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-2">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className={inputClass("phone")}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-2">{errors.phone}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What is this about?"
                  className={inputClass("subject")}
                />
                {errors.subject && (
                  <p className="text-red-500 text-xs mt-2">{errors.subject}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order Number <span className="text-gray-400">(optional)</span>
                </label>
                <input
                  type="text"
                  name="orderNumber"
                  value={formData.orderNumber}
                  onChange={handleChange}
                  placeholder="e.g. ORD12345"
                  className={inputClass("orderNumber")}
                />
                {errors.orderNumber && (
                  <p className="text-red-500 text-xs mt-2">
                    {errors.orderNumber}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                name="message"
                rows="6"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us how we can help you..."
                className={inputClass("message")}
              />
              {errors.message && (
                <p className="text-red-500 text-xs mt-2">{errors.message}</p>
              )}
            </div>

            {errors.submit && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {errors.submit}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-black text-white py-3.5 px-6 rounded-lg text-sm font-medium hover:bg-gray-800 transition disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Sending Message...
                </>
              ) : (
                "Send Message"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;