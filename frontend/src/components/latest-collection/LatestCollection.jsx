
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import Title from "../title/Title";
import ProductItem from "../product-item/ProductItem";

const LatestCollection = () => {
  const { products } = useContext(AppContext);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    setLatestProducts(products.slice(0, 10));
  }, [products]);

  return (
    <div className="my-10">
      <div className="text-center">
        <Title text1="LATEST" text2="COLLECTION" />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600 mb-4">
          Discover our newest arrivals carefully curated styles designed to
          elevate your everyday look with quality, comfort, and timeless appeal.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {latestProducts?.map((item, index) => (
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

export default LatestCollection;
