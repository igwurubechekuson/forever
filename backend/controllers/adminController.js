import jwt from "jsonwebtoken";
import Product from "../models/Product.js";

// =========================Create Token =========================
const createToken = () => {
  return jwt.sign({ role: "admin" }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

// ========================Admin Login =========================
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD?.trim();

    if (!adminEmail || !adminPassword || !process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "Admin environment variables are not configured properly",
      });
    }

    if (
      normalizedEmail !== adminEmail ||
      password.trim() !== adminPassword
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials",
      });
    }

    const token = createToken();

    return res.status(200).json({
      success: true,
      message: "Admin login successful",
      token,
    });
  } catch (error) {
    console.error("Admin login error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to login admin",
    });
  }
};

// ========================Add product =========================
const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
    } = req.body;

    if (
      !name?.trim() ||
      !description?.trim() ||
      !price ||
      !category?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, description, price, and category are required",
      });
    }

    const parsedPrice = Number(price);

    if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be a valid number greater than 0",
      });
    }

    const image1 = req.files?.image1?.[0]?.path || "";
    const image2 = req.files?.image2?.[0]?.path || "";
    const image3 = req.files?.image3?.[0]?.path || "";
    const image4 = req.files?.image4?.[0]?.path || "";

    const images = [image1, image2, image3, image4].filter(Boolean);

    if (images.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one product image is required",
      });
    }

    let parsedSizes = [];

    if (sizes) {
      try {
        parsedSizes = typeof sizes === "string" ? JSON.parse(sizes) : sizes;

        if (!Array.isArray(parsedSizes)) {
          return res.status(400).json({
            success: false,
            message: "Sizes must be an array",
          });
        }
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid sizes format. Send sizes as a JSON array",
        });
      }
    }

    const product = await Product.create({
      name: name.trim(),
      description: description.trim(),
      price: parsedPrice,
      category: category.trim(),
      subCategory: subCategory?.trim() || "",
      sizes: parsedSizes,
      bestseller: bestseller === "true" || bestseller === true,
      image: images,
      date: Date.now(),
    });

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    console.error("Add product error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to add product",
    });
  }
};

// =======================List all products =========================
const ListAllProduct = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1, _id: -1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("List all products error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch products",
    });
  }
};

// ========================get single product =========================
const singleProduct = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Single product error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch product",
    });
  }
};

// ========================Delete product =========================
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to delete product",
    });
  }
};
export {
  adminLogin,
  addProduct,
  ListAllProduct,
  singleProduct,
  deleteProduct,
};