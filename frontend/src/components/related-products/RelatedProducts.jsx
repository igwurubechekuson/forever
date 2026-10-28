/* eslint-disable react-hooks/set-state-in-effect */
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import Title from "../title/Title";
import ProductItem from "../product-item/ProductItem";

const RelatedProducts = ({ category, subCategory, currentProductId }) => {
  const { products } = useContext(AppContext);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (!products.length || !category || !subCategory) return;

    let productsCopy = products.slice();

    productsCopy = productsCopy.filter(
      (item) =>
        item._id !== currentProductId &&
        item.category === category &&
        item.subCategory === subCategory
    );

    setRelated(productsCopy.slice(0, 5));
  }, [products, category, subCategory, currentProductId]);

  if (!related.length) return null;

  return (
    <div className="my-20 mt-6">
      <div className="text-center text-3xl py-2">
        <Title text1="RELATED" text2="PRODUCTS" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {related.map((item) => (
          <ProductItem
            key={item._id}
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

export default RelatedProducts;