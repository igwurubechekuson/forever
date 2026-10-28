import Newsletter from "../models/Newsletter.js";
import validator from "validator";

// ========================= Subscribe =========================
const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (!validator.isEmail(trimmedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address",
      });
    }

    // check if already exists
    const existing = await Newsletter.findOne({ email: trimmedEmail });

    if (existing) {
      return res.status(200).json({
        success: true,
        message: "You are already subscribed",
      });
    }

    const newSubscriber = new Newsletter({
      email: trimmedEmail,
    });

    await newSubscriber.save();

    return res.status(201).json({
      success: true,
      message: "Subscribed successfully",
    });
  } catch (error) {
    console.error("subscribeNewsletter error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to subscribe",
    });
  }
};

export { subscribeNewsletter };