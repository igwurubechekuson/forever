import express from "express";
import authUser from "../middleware/authUser.js";
import {
  addReview,
  getProductReviews,
  deleteReview,
} from "../controllers/reviewController.js";

const reviewRouter = express.Router();

reviewRouter.get("/:productId", getProductReviews);
reviewRouter.post("/add", authUser, addReview);
reviewRouter.delete("/:reviewId", authUser, deleteReview);

export default reviewRouter;