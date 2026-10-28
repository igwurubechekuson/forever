import React from "react";
import Title from "../../components/title/Title";

const deliveryInfo = [
  {
    title: "Order Processing",
    description:
      "All orders are processed as quickly as possible after successful payment confirmation. Orders placed on weekends or public holidays will be processed on the next business day.",
  },
  {
    title: "Delivery Time",
    description:
      "Standard delivery usually takes between 2 to 5 business days depending on your location. Delivery timelines may vary during peak periods, public holidays, or due to unforeseen logistics delays.",
  },
  {
    title: "Shipping Coverage",
    description:
      "We deliver to selected cities and regions nationwide. Delivery availability depends on your shipping address and our logistics partners’ coverage in that location.",
  },
  {
    title: "Delivery Charges",
    description:
      "Delivery fees are calculated at checkout based on your location and order details. From time to time, we may offer free delivery promotions on eligible orders.",
  },
];

const deliverySteps = [
  "Place your order and receive confirmation.",
  "Your order is verified and prepared for dispatch.",
  "The package is handed over to our delivery partner.",
  "Your order is delivered to your provided address.",
];

const deliveryPolicy = [
  "Please ensure your name, phone number, and delivery address are entered correctly during checkout.",
  "A valid phone number is required so our dispatch rider or logistics partner can reach you if needed.",
  "If a delivery attempt fails due to an unreachable customer or incorrect address, re-delivery charges may apply.",
  "Orders may only be delivered to the address provided during checkout unless otherwise confirmed with support before dispatch.",
];

const DeliveryInformation = () => {
  return (
    <div className="px-6 md:px-16 lg:px-24 py-10">
      <div className="text-2xl text-center border-t pt-8">
        <Title text1="DELIVERY" text2="INFORMATION" />
      </div>

      <div className="max-w-6xl mx-auto mt-10 flex flex-col gap-10">
        {/* Intro */}
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-sm sm:text-base text-gray-600 leading-7">
            At <span className="font-semibold text-gray-800">Forever</span>, we
            are committed to delivering your orders quickly, safely, and
            efficiently. Below is everything you need to know about our
            delivery process, timelines, charges, and important shipping
            guidelines.
          </p>
        </div>

        {/* Overview cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {deliveryInfo.map((item) => (
            <div
              key={item.title}
              className="border border-gray-200 rounded-2xl p-6 bg-white hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold text-gray-800">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 mt-3 leading-7">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Delivery process */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="border border-gray-200 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-800">
              How Delivery Works
            </h3>
            <p className="text-sm text-gray-600 mt-2 leading-7">
              Our delivery process is designed to keep things simple and
              transparent from checkout to doorstep.
            </p>

            <div className="mt-6 flex flex-col gap-4">
              {deliverySteps.map((step, index) => (
                <div key={step} className="flex items-start gap-4">
                  <div className="min-w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </div>
                  <p className="text-sm text-gray-600 leading-7 pt-1">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-gray-200 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-800">
              Important Delivery Notes
            </h3>
            <p className="text-sm text-gray-600 mt-2 leading-7">
              Please review these important guidelines to avoid delays or failed
              deliveries.
            </p>

            <ul className="mt-6 flex flex-col gap-3">
              {deliveryPolicy.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-black" />
                  <p className="text-sm text-gray-600 leading-7">{item}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Extra sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="border border-gray-200 rounded-2xl p-6">
            <h3 className="text-base font-semibold text-gray-800">
              Same-Day / Express Delivery
            </h3>
            <p className="text-sm text-gray-600 mt-3 leading-7">
              Express delivery may be available in selected locations for
              eligible orders. Availability depends on your area, order time,
              and logistics capacity.
            </p>
          </div>

          <div className="border border-gray-200 rounded-2xl p-6">
            <h3 className="text-base font-semibold text-gray-800">
              Delayed Deliveries
            </h3>
            <p className="text-sm text-gray-600 mt-3 leading-7">
              While we aim to meet all estimated delivery timelines, delays can
              sometimes occur due to weather conditions, high order volume,
              public holidays, or logistics partner issues.
            </p>
          </div>

          <div className="border border-gray-200 rounded-2xl p-6">
            <h3 className="text-base font-semibold text-gray-800">
              Failed Delivery Attempts
            </h3>
            <p className="text-sm text-gray-600 mt-3 leading-7">
              If delivery cannot be completed because the recipient is
              unavailable or the address is incorrect, our team may contact you
              to reschedule delivery. Additional charges may apply where
              necessary.
            </p>
          </div>
        </div>

        {/* Support */}
        <div className="border border-gray-200 rounded-2xl p-6 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-800">
            Need Help With Delivery?
          </h3>
          <p className="text-sm text-gray-600 mt-3 leading-7">
            If you have questions about your order shipment, delivery timeline,
            or shipping charges, please contact our support team and we will be
            happy to assist you.
          </p>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-3">
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
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
                aria-hidden="true"
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryInformation;