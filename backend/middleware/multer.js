import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";


// =========================Cloudinary storage config =========================
const storage = new CloudinaryStorage({
  cloudinary,
});

// =========================File Storage =========================
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, PNG, WEBP images are allowed"), false);
  }
};

// ========================Multer instance =========================
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 7 * 1024 * 1024, // 7MB limit
  },
});

export default upload;