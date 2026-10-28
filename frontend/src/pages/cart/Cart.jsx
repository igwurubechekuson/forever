/* eslint-disable react-hooks/set-state-in-effect */
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import Title from "../../components/title/Title";
import { assets } from "../../assets/frontend_assets/assets";

const Cart = () => {
  const {
    currency,
    products,
    cartItems,
    updateQuantity,
    getCartAmount,
    delivery_fee,
    navigate
  } = useContext(AppContext);

  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    const tempData = [];

    for (const itemId in cartItems) {
      for (const size in cartItems[itemId]) {
        if (cartItems[itemId][size] > 0) {
          tempData.push({
            _id: itemId,
            size,
            quantity: cartItems[itemId][size],
          });
        }
      }
    }

    setCartData(tempData);
  }, [cartItems]);

  const subtotal = getCartAmount();
  const total = subtotal === 0 ? 0 : subtotal + delivery_fee;

  return (
    <div className="border-t pt-10">
      <div className="text-2xl mb-8">
        <Title text1="YOUR" text2="CART" />
      </div>

      {cartData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <img
            src={assets.cart_icon}
            alt="Empty cart"
            className="w-16 opacity-60 mb-4"
          />
          <p className="text-xl font-medium text-gray-800">Your cart is empty</p>
          <p className="text-sm text-gray-500 mt-2">
            Looks like you have not added anything yet.
          </p>
          <Link
            to="/collection"
            className="mt-6 bg-black text-white px-6 py-3 text-sm rounded-sm"
          >
            CONTINUE SHOPPING
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
          <div className="flex-1">
            {cartData.map((item, index) => {
              const productData = products.find(
                (product) => product._id === item._id
              );

              if (!productData) return null;

              return (
                <div
                  key={`${item._id}-${item.size}-${index}`}
                  className="py-6 border-t border-b text-gray-700 grid grid-cols-[4fr_1fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
                >
                  <div className="flex items-start gap-4">
                    <Link
                      to={`/product/${productData._id}`}
                      className="w-20 sm:w-24 shrink-0"
                    >
                      <img
                        className="w-full rounded-sm"
                        src={productData.image[0]}
                        alt={productData.name}
                      />
                    </Link>

                    <div>
                      <Link to={`/product/${productData._id}`}>
                        <p className="text-sm sm:text-lg font-medium text-gray-800 hover:text-black transition">
                          {productData.name}
                        </p>
                      </Link>

                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        <p className="text-base sm:text-lg">
                          {currency}
                          {productData.price.toLocaleString()}
                        </p>
                        <span className="px-2 sm:px-3 sm:py-1 border bg-slate-50 text-xs sm:text-sm">
                          Size: {item.size}
                        </span>
                      </div>
                    </div>
                  </div>

                  <input
                    type="number"
                    min={1}
                    defaultValue={item.quantity}
                    onChange={(e) => {
                      const value = Number(e.target.value);

                      if (Number.isNaN(value) || value < 1) {
                        updateQuantity(item._id, item.size, 1);
                      } else {
                        updateQuantity(item._id, item.size, value);
                      }
                    }}
                    className="border max-w-16 sm:max-w-20 px-2 py-1"
                  />

                  <img
                    onClick={() => updateQuantity(item._id, item.size, 0)}
                    className="w-4 mr-4 sm:w-5 cursor-pointer"
                    src={assets.bin_icon}
                    alt="Remove item"
                  />
                </div>
              );
            })}
          </div>

          <div className="w-full lg:max-w-[420px]">
            <div className="border rounded-sm p-6 bg-gray-50">
              <div className="text-2xl mb-6">
                <Title text1="CART" text2="TOTALS" />
              </div>

              <div className="flex flex-col gap-4 text-sm">
                <div className="flex justify-between">
                  <p className="text-gray-600">Subtotal</p>
                  <p className="font-medium">
                    {currency}
                    {subtotal}
                  </p>
                </div>

                <hr />

                <div className="flex justify-between">
                  <p className="text-gray-600">Delivery Fee</p>
                  <p className="font-medium">
                    {currency}
                    {subtotal === 0 ? 0 : delivery_fee}
                  </p>
                </div>

                <hr />

                <div className="flex justify-between text-base">
                  <p className="font-semibold">Total</p>
                  <p className="font-semibold">
                    {currency}
                    {total}
                  </p>
                </div>
              </div>

              <button onClick={() => navigate("/place-order")} className="w-full bg-black text-white py-3 mt-6 text-sm rounded-sm active:bg-gray-800 cursor-pointer">
                PROCEED TO CHECKOUT
              </button>

              <Link
                to="/collection"
                className="block text-center mt-4 text-sm text-gray-600 hover:text-black"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;