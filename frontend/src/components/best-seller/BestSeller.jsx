/* eslint-disable react-hooks/set-state-in-effect */
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import Title from "../title/Title";
import ProductItem from "../product-item/ProductItem";

const BestSeller = () => {
  const { products } = useContext(AppContext);
  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {
    const bestProduct = products.filter((item) => item.bestseller);
    setBestSeller(bestProduct.slice(0, 5));
  }, [products]);

  return (
    <div className="my-10">
      <div className="text-center">
        <Title text1="BEST" text2="SELLER" />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600 mb-4">
          Discover our best seller products carefully curated styles designed to
          elevate your everyday look with quality, comfort, and timeless appeal.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {bestSeller?.map((item, index) => (
          <ProductItem
            key={index}
            id={item._id}
            image={item.image}
            name={item.name}
            price={item.price.toLocaleString()}
          />
        ))}
      </div>
    </div>
  );
};

export default BestSeller;
