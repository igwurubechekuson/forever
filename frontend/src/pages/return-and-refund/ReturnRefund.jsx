import React from "react";
import { Link } from "react-router-dom";
import Title from "../../components/title/Title";

const ReturnRefund = () => {
  return (
    <div className="px-6 md:px-16 lg:px-24 py-10">
      <div className="text-2xl text-center border-t pt-8">
        <Title text1="RETURN" text2="& REFUND POLICY" />
      </div>

      <div className="max-w-4xl mx-auto mt-10 flex flex-col gap-8 text-gray-600 text-sm leading-7">
        <p>
          At <span className="font-semibold text-gray-800">Forever</span>, we
          are committed to providing high-quality products and a seamless
          shopping experience. If you are not completely satisfied with your
          purchase, we are here to help.
        </p>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Returns</h3>
          <p>
            You may request a return within <b>7 days</b> of receiving your
            order. To be eligible for a return:
          </p>
          <ul className="list-disc pl-5 mt-2 flex flex-col gap-1">
            <li>The item must be unused and in its original condition</li>
            <li>All tags must be intact</li>
            <li>The item must be in its original packaging</li>
            <li>Proof of purchase (order receipt) is required</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Non-Returnable Items
          </h3>
          <p>The following items cannot be returned:</p>
          <ul className="list-disc pl-5 mt-2 flex flex-col gap-1">
            <li>Worn, washed, or damaged items not due to our error</li>
            <li>Items without original tags or packaging</li>
            <li>Sale or clearance items unless defective</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Refunds</h3>
          <p>
            Once your return is received and inspected, we will notify you of
            the approval or rejection of your refund.
          </p>
          <ul className="list-disc pl-5 mt-2 flex flex-col gap-1">
            <li>Approved refunds are processed within 3 to 5 business days</li>
            <li>Refunds are issued to your original payment method</li>
            <li>
              Shipping fees are non-refundable unless the return is due to our
              error
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Exchanges</h3>
          <p>
            We only replace items if they are defective, damaged, or incorrect.
            If you need an exchange, please contact our support team with your
            order details.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            How to Initiate a Return
          </h3>
          <ol className="list-decimal pl-5 mt-2 flex flex-col gap-1">
            <li>Contact our support team via email or phone</li>
            <li>Provide your order number and reason for return</li>
            <li>Follow the return instructions provided</li>
            <li>Ship the item back to us</li>
          </ol>
        </div>

        <div className="border border-gray-200 rounded-xl p-5 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Need Help?
          </h3>
          <p>
            If you have any questions about our return and refund policy, feel
            free to reach out to us:
          </p>

          <div className="mt-4 flex flex-col gap-3 text-sm text-gray-600">
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
          </div>
        </div>

        <div className="flex justify-center pt-2">
          <Link
            to="/contact"
            state={{ subject: "Return Request" }}
            className="inline-flex items-center justify-center rounded-lg bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Request a Return
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReturnRefund;