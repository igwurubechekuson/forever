import jwt from "jsonwebtoken";

const adminAuth = (req, res, next) => {
  try {
    const token = req.headers.atoken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, token missing",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied, admin only",
      });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    console.error("Admin auth error:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default adminAuth;