/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const backendUrl = "https://forever-backend-phi-ten.vercel.app";
export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const currency = "₦";
  const delivery_fee = 3000;

  const [cartItems, setCartItems] = useState({});
  const [search, setSearch] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [showSearch, setShowSearch] = useState(false);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // ========================= Get Products =========================
  const getproductsData = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/v1/product/all-products`
      );

      if (data.success) {
        setProducts(data.products || []);
      } else {
        toast.error(data.message || "Failed to fetch products");
      }
    } catch (error) {
      console.error("get product error:", error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // ========================= Get Reviews For Product =========================
  const getProductReviews = async (productId) => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/v1/review/${productId}`);

      if (data.success) {
        return {
          reviews: data.reviews || [],
          stats: data.stats || { rating: 0, reviewCount: 0 },
        };
      }

      toast.error(data.message || "Failed to fetch reviews");
      return {
        reviews: [],
        stats: { rating: 0, reviewCount: 0 },
      };
    } catch (error) {
      console.error("getProductReviews error:", error);
      toast.error(error.response?.data?.message || error.message);
      return {
        reviews: [],
        stats: { rating: 0, reviewCount: 0 },
      };
    }
  };

  // ========================= Add Review =========================
  const addProductReview = async ({ productId, rating, comment }) => {
    if (!token) {
      toast.error("Please login to leave a review");
      navigate("/login");
      return { success: false };
    }

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/v1/review/add`,
        { productId, rating, comment },
        {
          headers: {
            token,
          },
        }
      );

      if (data.success) {
        toast.success(data.message || "Review submitted successfully");
        await getproductsData();
        return {
          success: true,
          reviews: data.reviews || [],
        };
      }

      toast.error(data.message || "Failed to submit review");
      return { success: false };
    } catch (error) {
      console.error("addProductReview error:", error);
      toast.error(error.response?.data?.message || error.message);
      return { success: false };
    }
  };

  // ========================= Delete Review =========================
  const deleteProductReview = async (reviewId) => {
    if (!token) {
      toast.error("Please login first");
      navigate("/login");
      return { success: false };
    }

    try {
      const { data } = await axios.delete(
        `${backendUrl}/api/v1/review/${reviewId}`,
        {
          headers: {
            token,
          },
        }
      );

      if (data.success) {
        toast.success(data.message || "Review deleted successfully");
        await getproductsData();
        return { success: true };
      }

      toast.error(data.message || "Failed to delete review");
      return { success: false };
    } catch (error) {
      console.error("deleteProductReview error:", error);
      toast.error(error.response?.data?.message || error.message);
      return { success: false };
    }
  };

  // ========================= Load Cart From Backend =========================
  const getUserCart = async (passedToken) => {
    try {
      const activeToken = passedToken || token;

      if (!activeToken) {
        setCartItems({});
        return;
      }

      const { data } = await axios.post(
        `${backendUrl}/api/v1/cart/get`,
        {},
        {
          headers: {
            token: activeToken,
          },
        }
      );

      if (data.success) {
        setCartItems(data.cartData || {});
      } else {
        setCartItems({});
        toast.error(data.message || "Failed to load cart");
      }
    } catch (error) {
      console.error("getUserCart error:", error);
      setCartItems({});
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // ========================= Add To Cart =========================
  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Please select a size");
      return;
    }

    const productInfo = products.find((item) => item._id === itemId);

    setCartItems((prev) => {
      const cartData = structuredClone(prev);

      if (!cartData[itemId]) {
        cartData[itemId] = {};
      }

      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }

      return cartData;
    });

    toast.success(`${productInfo?.name || "Product"} added to cart (${size})`);

    if (!token) return;

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/v1/cart/add`,
        { itemId, size },
        {
          headers: {
            token,
          },
        }
      );

      if (data.success) {
        setCartItems(data.cartData || {});
      } else {
        toast.error(data.message || "Failed to add item to cart");
        await getUserCart(token);
      }
    } catch (error) {
      console.error("addToCart error:", error);
      toast.error(error.response?.data?.message || error.message);
      await getUserCart(token);
    }
  };

  // ========================= Update Quantity =========================
  const updateQuantity = async (itemId, size, quantity) => {
    const productInfo = products.find((item) => item._id === itemId);

    setCartItems((prev) => {
      const cartData = structuredClone(prev);

      if (!cartData[itemId]) return prev;

      if (quantity <= 0) {
        delete cartData[itemId][size];

        if (Object.keys(cartData[itemId]).length === 0) {
          delete cartData[itemId];
        }
      } else {
        cartData[itemId][size] = quantity;
      }

      return cartData;
    });

    if (quantity <= 0) {
      toast.info(`${productInfo?.name || "Product"} removed from cart (${size})`);
    }

    if (!token) return;

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/v1/cart/update`,
        { itemId, size, quantity },
        {
          headers: {
            token,
          },
        }
      );

      if (data.success) {
        setCartItems(data.cartData || {});
      } else {
        toast.error(data.message || "Failed to update cart");
        await getUserCart(token);
      }
    } catch (error) {
      console.error("updateQuantity error:", error);
      toast.error(error.response?.data?.message || error.message);
      await getUserCart(token);
    }
  };

  // ========================= Login Helper =========================
  const loginUser = async (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  // ========================= Logout Helper =========================
  const logoutUser = () => {
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
    navigate("/login");
  };

  // ========================= Get Cart Count =========================
  const getCartCount = () => {
    let totalCount = 0;

    for (const itemId in cartItems) {
      for (const size in cartItems[itemId]) {
        const qty = cartItems[itemId][size];
        if (qty > 0) {
          totalCount += qty;
        }
      }
    }

    return totalCount;
  };

  // ========================= Get Cart Amount =========================
  const getCartAmount = () => {
    let totalAmount = 0;

    for (const itemId in cartItems) {
      const itemInfo = products.find((product) => product._id === itemId);

      if (!itemInfo) continue;

      for (const size in cartItems[itemId]) {
        const qty = cartItems[itemId][size];
        if (qty > 0) {
          totalAmount += itemInfo.price * qty;
        }
      }
    }

    return totalAmount;
  };

  // ========================= Initial Load =========================
  useEffect(() => {
    getproductsData();
  }, []);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      getUserCart(token);
    } else {
      localStorage.removeItem("token");
      setCartItems({});
    }
  }, [token]);

  const value = {
    cartItems,
    setCartItems,
    addToCart,
    updateQuantity,
    getCartCount,
    getCartAmount,
    getUserCart,
    loginUser,
    logoutUser,
    delivery_fee,
    currency,
    products,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    navigate,
    token,
    setToken,
    backendUrl,
    getproductsData,
    getProductReviews,
    addProductReview,
    deleteProductReview,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;