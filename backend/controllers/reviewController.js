import mongoose from "mongoose";
import Review from "../models/Review.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import Order from "../models/Order.js";

// ========================= Recalculate product rating =========================
const updateProductReviewStats = async (productId) => {
  const stats = await Review.aggregate([
    {
      $match: {
        productId: new mongoose.Types.ObjectId(productId),
        isApproved: true,
      },
    },
    {
      $group: {
        _id: "$productId",
        avgRating: { $avg: "$rating" },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      rating: Number(stats[0].avgRating.toFixed(1)),
      reviewCount: stats[0].reviewCount,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      rating: 0,
      reviewCount: 0,
    });
  }
};

// ========================= Add Review =========================
const addReview = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { productId, rating, comment } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Valid productId is required",
      });
    }

    const parsedRating = Number(rating);

    if (!parsedRating || parsedRating < 1 || parsedRating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    if (!comment?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment is required",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const user = await User.findById(userId).select("name");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const hasPurchased = await Order.findOne({
      userId,
      "items.productId": productId,
      status: "Delivered",
    });

    if (!hasPurchased) {
      return res.status(403).json({
        success: false,
        message: "Only customers who purchased this product can review it",
      });
    }

    const existingReview = await Review.findOne({ productId, userId });

    if (existingReview) {
      existingReview.rating = parsedRating;
      existingReview.comment = comment.trim();
      existingReview.userName = user.name;

      await existingReview.save();
    } else {
      await Review.create({
        productId,
        userId,
        userName: user.name,
        rating: parsedRating,
        comment: comment.trim(),
      });
    }

    await updateProductReviewStats(productId);

    const reviews = await Review.find({
      productId,
      isApproved: true,
    })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      message: existingReview
        ? "Review updated successfully"
        : "Review added successfully",
      reviews,
    });
  } catch (error) {
    console.error("addReview error:", error);
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to add review",
    });
  }
};

// ========================= Get Product Reviews =========================
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Valid productId is required",
      });
    }

    const reviews = await Review.find({
      productId,
      isApproved: true,
    })
      .sort({ createdAt: -1 })
      .lean();

    const product = await Product.findById(productId)
      .select("rating reviewCount")
      .lean();

    return res.status(200).json({
      success: true,
      reviews,
      stats: {
        rating: product?.rating || 0,
        reviewCount: product?.reviewCount || 0,
      },
    });
  } catch (error) {
    console.error("getProductReviews error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
    });
  }
};

// ========================= Delete Review (Admin or Owner) =========================
const deleteReview = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { reviewId } = req.params;

    if (!reviewId || !mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({
        success: false,
        message: "Valid reviewId is required",
      });
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (review.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this review",
      });
    }

    const productId = review.productId;
    await Review.findByIdAndDelete(reviewId);
    await updateProductReviewStats(productId);

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("deleteReview error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete review",
    });
  }
};

export { addReview, getProductReviews, deleteReview, updateProductReviewStats };
