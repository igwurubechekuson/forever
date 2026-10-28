import { useMemo, useState } from "react";
import Title from "../../components/title/Title";

const faqData = [
  {
    question: "How do I place an order?",
    answer:
      "Browse our collections, select your preferred item, choose the size and quantity, then add it to your cart. Once you are ready, proceed to checkout, enter your delivery details, choose your payment method, and confirm your order.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept secure online payments through Paystack, including debit and credit cards, bank transfers, and other supported payment options. Cash on Delivery may also be available in selected locations.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Delivery usually takes between 2 to 5 business days, depending on your location and order volume. Orders placed on weekends or public holidays are processed on the next business day.",
  },
  {
    question: "Can I return or exchange an item?",
    answer:
      "Yes, eligible items can be returned or exchanged within our return window, provided they are unused, unwashed, and in their original condition with tags intact. Please review our return policy for full details.",
  },
  {
    question: "How do I track my order?",
    answer:
      "After placing your order, you can track its progress from the Orders page in your account. Once your order has been processed or shipped, the latest status will be updated there.",
  },
  {
    question: "Do I need an account to place an order?",
    answer:
      "You can browse products without an account, but creating an account makes it easier to manage your orders, save your delivery details, and enjoy a faster checkout experience.",
  },
  {
    question: "Can I cancel my order after placing it?",
    answer:
      "Orders can only be cancelled before they are processed for shipping. Once an order has been confirmed and prepared, cancellation may no longer be possible. Please contact support as quickly as possible if you need help.",
  },
  {
    question: "What should I do if I receive a wrong or damaged item?",
    answer:
      "If you receive a wrong, defective, or damaged item, contact our support team immediately with your order details and clear photos of the item. We will review the issue and assist with a replacement or return process.",
  },
  {
    question: "Are your products true to size?",
    answer:
      "We aim to provide accurate sizing information for every product. We recommend checking the product size guide before ordering to ensure the best fit.",
  },
  {
    question: "Do you restock sold-out items?",
    answer:
      "Some popular items may be restocked depending on availability and demand. You can keep checking the product page or follow our updates for restock announcements.",
  },
  {
    question: "Is my payment information secure?",
    answer:
      "Yes, your payment information is handled through secure and trusted payment gateways. We prioritize the protection of your personal and transaction data.",
  },
  {
    question: "Do you offer nationwide delivery?",
    answer:
      "Yes, we aim to deliver to customers across multiple locations. Delivery availability and shipping fees may vary depending on your destination.",
  },
];

const ChevronIcon = ({ isOpen }) => {
  return (
    <svg
      className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
        isOpen ? "rotate-180" : "rotate-0"
      }`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
};

const FAQs = () => {
  const [openIndexes, setOpenIndexes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleFAQ = (index) => {
    setOpenIndexes((prev) =>
      prev.includes(index)
        ? prev.filter((item) => item !== index)
        : [...prev, index]
    );
  };

  const filteredFaqs = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) return faqData;

    return faqData.filter(
      (faq) =>
        faq.question.toLowerCase().includes(term) ||
        faq.answer.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  return (
    <div className="px-6 md:px-16 lg:px-24 py-10">
      <div className="text-2xl text-center border-t pt-8">
        <Title text1="FREQUENTLY" text2="ASKED QUESTIONS" />
      </div>

      <div className="max-w-3xl mx-auto mt-8">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search FAQs..."
            className="w-full border border-gray-300 rounded-full py-3 pl-5 pr-12 text-sm outline-none focus:border-black transition"
          />

          <svg
            className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-4.35-4.35m1.85-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
      </div>

      <div className="max-w-3xl mx-auto mt-8 flex flex-col gap-4">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, index) => {
            const actualIndex = faqData.findIndex(
              (item) =>
                item.question === faq.question && item.answer === faq.answer
            );

            const isOpen = openIndexes.includes(actualIndex);

            return (
              <div
                key={`${faq.question}-${index}`}
                className="border border-gray-200 rounded-xl bg-white overflow-hidden hover:shadow-md transition"
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(actualIndex)}
                  className="w-full flex items-center justify-between gap-4 text-left px-5 py-4 cursor-pointer"
                >
                  <span className="font-medium text-gray-800 text-sm sm:text-base">
                    {faq.question}
                  </span>
                  <ChevronIcon isOpen={isOpen} />
                </button>

                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm text-gray-600 leading-6">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center border border-gray-200 rounded-xl py-10 px-6 text-gray-500">
            No FAQs found for "<span className="font-medium">{searchTerm}</span>
            "
          </div>
        )}
      </div>
    </div>
  );
};

export default FAQs;
