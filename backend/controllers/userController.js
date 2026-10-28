import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import mongoose from "mongoose";
import User from "../models/User.js";

// ========================= Create Token =========================
const createToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

// ======================== Register user =========================
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    if (name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Name must be at least 2 characters long",
      });
    }

    if (!validator.isEmail(email.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    const token = createToken(user._id);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        cartData: user.cartData,
        addresses: user.addresses,
        defaultAddressId: user.defaultAddressId,
      },
    });
  } catch (error) {
    console.error("Register user error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to register user",
    });
  }
};

// ========================= Login user =========================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = createToken(user._id);

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        cartData: user.cartData,
        addresses: user.addresses,
        defaultAddressId: user.defaultAddressId,
      },
    });
  } catch (error) {
    console.error("Login user error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to login user",
    });
  }
};

// ========================= Get user profile =========================
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Please login again",
      });
    }

    const user = await User.findById(userId).select("-password").lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      user,
    });
  } catch (error) {
    console.error("Get user profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch profile",
    });
  }
};

// ========================= Update user profile =========================
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { name, phone, avatar } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Please login again",
      });
    }

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    if (name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Name must be at least 2 characters long",
      });
    }

    if (phone && phone.trim().length < 7) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid phone number",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name: name.trim(),
        phone: phone?.trim() || "",
        avatar: avatar?.trim() || "",
      },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update user profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to update profile",
    });
  }
};

// ========================= Add user address =========================
const addUserAddress = async (req, res) => {
  try {
    const userId = req.user?.id;
    const {
      label,
      firstName,
      lastName,
      email,
      street,
      city,
      state,
      zipcode,
      country,
      phone,
    } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Please login again",
      });
    }

    const requiredFields = [
      firstName,
      lastName,
      email,
      street,
      city,
      state,
      zipcode,
      country,
      phone,
    ];

    if (requiredFields.some((field) => !field?.trim())) {
      return res.status(400).json({
        success: false,
        message: "All address fields are required",
      });
    }

    if (!validator.isEmail(email.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const newAddress = {
      label: label?.trim() || "Home",
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      street: street.trim(),
      city: city.trim(),
      state: state.trim(),
      zipcode: zipcode.trim(),
      country: country.trim(),
      phone: phone.trim(),
      isDefault: user.addresses.length === 0,
    };

    user.addresses.push(newAddress);

    if (user.addresses.length === 1) {
      user.defaultAddressId = user.addresses[0]._id;
    }

    await user.save();

    return res.status(201).json({
      success: true,
      message: "Address added successfully",
      addresses: user.addresses,
      defaultAddressId: user.defaultAddressId,
    });
  } catch (error) {
    console.error("Add user address error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to add address",
    });
  }
};

// ========================= Delete user address =========================
const deleteUserAddress = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { addressId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Please login again",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(addressId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid address id",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const addressExists = user.addresses.some(
      (address) => address._id.toString() === addressId
    );

    if (!addressExists) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    user.addresses = user.addresses.filter(
      (address) => address._id.toString() !== addressId
    );

    if (
      user.defaultAddressId &&
      user.defaultAddressId.toString() === addressId
    ) {
      user.defaultAddressId = user.addresses[0]?._id || null;

      user.addresses = user.addresses.map((address, index) => ({
        ...address.toObject(),
        isDefault: index === 0,
      }));
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Address deleted successfully",
      addresses: user.addresses,
      defaultAddressId: user.defaultAddressId,
    });
  } catch (error) {
    console.error("Delete user address error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to delete address",
    });
  }
};

// ========================= Set default address =========================
const setDefaultAddress = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { addressId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Please login again",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(addressId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid address id",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const addressExists = user.addresses.some(
      (address) => address._id.toString() === addressId
    );

    if (!addressExists) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    user.defaultAddressId = addressId;
    user.addresses = user.addresses.map((address) => ({
      ...address.toObject(),
      isDefault: address._id.toString() === addressId,
    }));

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Default address updated successfully",
      addresses: user.addresses,
      defaultAddressId: user.defaultAddressId,
    });
  } catch (error) {
    console.error("Set default address error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to update default address",
    });
  }
};

export {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  addUserAddress,
  deleteUserAddress,
  setDefaultAddress,
};