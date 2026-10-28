import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { Link } from "react-router-dom";

const ProductItem = ({ id, image, name, price }) => {
  const { currency } = useContext(AppContext);
  return (
    <Link to={`/product/${id}`} className="text-gray-700">
      <div className="overflow-hidden">
        <img
          className="hover:scale-110 transition ease-in-out"
          src={image[0]}
          alt=""
        />
      </div>
      <p className="pt-3 pb-1 text-sm">{name}</p>
      <p className="font-medium text-sm">
        {currency} {price.toLocaleString()}
      </p>
    </Link>
  );
};

export default ProductItem;
