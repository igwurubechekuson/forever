import Product from "../models/Product.js";

// ======================== get all products =========================
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1, _id: -1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("get all products error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch products",
    });
  }
};

export { getProducts };
