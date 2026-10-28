import { getProducts } from "../controllers/productController.js";
import express from "express";

const productRouter = express.Router();


productRouter.get("/all-products", getProducts);

export default productRouter;