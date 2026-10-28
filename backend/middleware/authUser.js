import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  try {
    const token = req.headers.token || req.header("token");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Please login again",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    req.user = { id: decoded.id };
    next();
  } catch (error) {
    console.error("authUser error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

export default authUser;