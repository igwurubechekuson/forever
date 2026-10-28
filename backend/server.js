import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import { connectCloudinary } from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import adminRouter from "./routes/adminRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import newsletterRouter from "./routes/newsletterRoute.js";
import contactRouter from "./routes/contactRoute.js";
import reviewRouter from "./routes/reviewRoute.js";

dotenv.config();

// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); 
app.use(morgan("dev")); 

// Port
const PORT = process.env.PORT || 4000;

// Connect services
connectDB();
connectCloudinary();

// Health check route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is working",
  });
});
// Api endpoints
app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/newsletter", newsletterRouter);
app.use("/api/v1/contact", contactRouter);
app.use("/api/v1/review", reviewRouter);


// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});