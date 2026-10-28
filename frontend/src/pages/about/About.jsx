import React from "react";
import Title from "../../components/title/Title";
import { assets } from "../../assets/frontend_assets/assets";

const About = () => {
  return (
    <div>
      {/* Title */}
      <div className="text-2xl text-center pt-8 border-t">
        <Title text1="ABOUT" text2="US" />
      </div>

      {/* Content */}
      <div className="my-10 flex flex-col md:flex-row gap-16 items-center">
        {/* Image */}
        <img
          className="w-full max-w-[450px] rounded-lg shadow-md"
          src={assets.about_img}
          alt="About Forever"
        />

        {/* Text */}
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
          <p>
            Welcome to{" "}
            <span className="font-semibold text-gray-800">Forever</span>, your
            go to destination for premium fashion and everyday style. We are an
            e-commerce platform dedicated to making clothing shopping seamless,
            enjoyable, and accessible for everyone.
          </p>

          <p>
            At Forever, we bring together carefully curated collections of
            clothing that combine comfort, quality, and modern trends. Whether
            you're looking for casual wear, statement outfits, or everyday
            essentials, we ensure that every piece meets a high standard of
            style and durability.
          </p>

          <p>
            Our platform is built with a focus on user experience from easy
            browsing and secure payments to fast delivery and reliable customer
            support. We believe shopping should not just be convenient, but also
            inspiring.
          </p>

          {/* Mission */}
          <b className="text-gray-800 text-lg">Our Mission</b>
          <p>
            Our mission is to empower individuals to express themselves through
            fashion by providing high quality, affordable, and trend forward
            clothing. We aim to redefine online shopping by delivering
            exceptional value, building trust, and creating a community where
            style meets confidence.
          </p>
        </div>
      </div>

      <div className="text-xl py-4">
        <Title text1="WHY" text2="CHOOSE US" />
      </div>

      <div className="flex flex-col md:flex-row text-sm mb-20 gap-6">
        {/* Card 1 */}
        <div className="border px-10 md:px-12 py-8 sm:py-12 flex flex-col gap-4 rounded-lg hover:shadow-lg transition">
          <b className="text-gray-800 text-base">Premium Quality</b>
          <p className="text-gray-600">
            We carefully select and curate every product to ensure it meets high
            standards of quality, comfort, and durability. Your satisfaction is
            our priority.
          </p>
        </div>

        {/* Card 2 */}
        <div className="border px-10 md:px-12 py-8 sm:py-12 flex flex-col gap-4 rounded-lg hover:shadow-lg transition">
          <b className="text-gray-800 text-base">Affordable Pricing</b>
          <p className="text-gray-600">
            Enjoy the latest fashion trends at competitive prices. We believe
            great style should be accessible without compromising your budget.
          </p>
        </div>

        {/* Card 3 */}
        <div className="border px-10 md:px-12 py-8 sm:py-12 flex flex-col gap-4 rounded-lg hover:shadow-lg transition">
          <b className="text-gray-800 text-base">Fast & Reliable Delivery</b>
          <p className="text-gray-600">
            We ensure timely and secure delivery of your orders. From checkout
            to doorstep, your shopping experience is smooth and dependable.
          </p>
        </div>

        {/* Card 4 */}
        <div className="border px-10 md:px-12 py-8 sm:py-12 flex flex-col gap-4 rounded-lg hover:shadow-lg transition">
          <b className="text-gray-800 text-base">Secure Payments</b>
          <p className="text-gray-600">
            Shop with confidence using our trusted and secure payment options.
            Your transactions and personal information are always protected.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
