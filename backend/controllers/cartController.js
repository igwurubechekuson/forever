import User from "../models/User.js";

// ========================= Add To Cart =========================
const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId, size } = req.body;

    if (!itemId || !size) {
      return res.status(400).json({
        success: false,
        message: "Item ID and size are required",
      });
    }

    const userData = await User.findById(userId);

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let cartData = userData.cartData || {};

    // clone nested object safely
    cartData = JSON.parse(JSON.stringify(cartData));

    if (!cartData[itemId]) {
      cartData[itemId] = {};
    }

    cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;

    userData.cartData = cartData;
    userData.markModified("cartData");
    await userData.save();

    return res.status(200).json({
      success: true,
      message: "Item added to cart",
      cartData: userData.cartData,
    });
  } catch (error) {
    console.error("addToCart error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to add item to cart",
    });
  }
};

// ========================= Update Cart =========================
const updateCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId, size, quantity } = req.body;

    if (!itemId || !size || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: "Item ID, size and quantity are required",
      });
    }

    const parsedQuantity = Number(quantity);

    if (Number.isNaN(parsedQuantity) || parsedQuantity < 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a valid non-negative number",
      });
    }

    const userData = await User.findById(userId);

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let cartData = userData.cartData || {};

    // clone nested object safely
    cartData = JSON.parse(JSON.stringify(cartData));

    if (!cartData[itemId]) {
      cartData[itemId] = {};
    }

    if (parsedQuantity === 0) {
      delete cartData[itemId][size];

      if (Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId];
      }
    } else {
      cartData[itemId][size] = parsedQuantity;
    }

    userData.cartData = cartData;
    userData.markModified("cartData");
    await userData.save();

    return res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      cartData: userData.cartData,
    });
  } catch (error) {
    console.error("updateCart error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to update cart",
    });
  }
};

// ========================= Get User Cart =========================
const getUserCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const userData = await User.findById(userId).select("cartData");

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      cartData: userData.cartData || {},
    });
  } catch (error) {
    console.error("getUserCart error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch cart",
    });
  }
};

export { addToCart, updateCart, getUserCart };