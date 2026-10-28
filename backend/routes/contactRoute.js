import express from "express";
import { submitContactMessage } from "../controllers/contactController.js";

const contactRouter = express.Router();

contactRouter.post("/submit", submitContactMessage);

export default contactRouter;