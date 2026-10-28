import express from "express";
import {
  addProduct,
  adminLogin,
  ListAllProduct,
  singleProduct,
  deleteProduct,
} from "../controllers/adminController.js";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const adminRouter = express.Router();

adminRouter.post("/login", adminLogin);

adminRouter.post(
  "/add-product",
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  adminAuth,
  addProduct
);

adminRouter.get("/all-products", adminAuth, ListAllProduct);
adminRouter.get("/single-product", singleProduct);
adminRouter.delete("/delete-product/:id", adminAuth, deleteProduct);

export default adminRouter;