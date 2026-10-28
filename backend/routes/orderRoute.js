import express from "express";
import authUser from "../middleware/authUser.js";
import {
  placeOrderCOD,
  placeOrderPaystack,
  verifyPaystack,
  getUserOrders,
  allOrders,
  getSingleOrder,
  trackOrder,
  updateOrderStatus
} from "../controllers/orderController.js";
import adminAuth from "../middleware/adminAuth.js";

const orderRouter = express.Router();

orderRouter.get("/all-orders", adminAuth, allOrders);

orderRouter.post("/cod", authUser, placeOrderCOD);
orderRouter.post("/paystack", authUser, placeOrderPaystack);
orderRouter.post("/verify-paystack", authUser, verifyPaystack);
orderRouter.get("/user-orders", authUser, getUserOrders);
orderRouter.get("/details/:orderId", authUser, getSingleOrder);
orderRouter.get("/track/:orderId", authUser, trackOrder);
orderRouter.post("/update-status", adminAuth, updateOrderStatus);


export default orderRouter;