import express from "express";
import authUser from "../middleware/authUser.js";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  addUserAddress,
  deleteUserAddress,
  setDefaultAddress,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/get-profile", authUser, getUserProfile);
userRouter.put("/update-profile", authUser, updateUserProfile);

userRouter.post("/address/add", authUser, addUserAddress);
userRouter.delete("/address/:addressId", authUser, deleteUserAddress);
userRouter.put("/address/default/:addressId", authUser, setDefaultAddress);

export default userRouter;