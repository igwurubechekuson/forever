import validator from "validator";
import Contact from "../models/Contact.js";

const submitContactMessage = async (req, res) => {
  try {
    const {
      fullName = "",
      email = "",
      phone = "",
      subject = "",
      orderNumber = "",
      message = "",
    } = req.body;

    const trimmedFullName = fullName.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPhone = phone.trim();
    const trimmedSubject = subject.trim();
    const trimmedOrderNumber = orderNumber.trim();
    const trimmedMessage = message.trim();

    const errors = {};

    if (!trimmedFullName) {
      errors.fullName = "Full name is required";
    } else if (trimmedFullName.length < 2) {
      errors.fullName = "Full name must be at least 2 characters";
    }

    if (!trimmedEmail) {
      errors.email = "Email address is required";
    } else if (!validator.isEmail(trimmedEmail)) {
      errors.email = "Please enter a valid email address";
    }

    if (!trimmedPhone) {
      errors.phone = "Phone number is required";
    } else if (!/^[0-9+\s()-]{7,20}$/.test(trimmedPhone)) {
      errors.phone = "Please enter a valid phone number";
    }

    if (!trimmedSubject) {
      errors.subject = "Subject is required";
    } else if (trimmedSubject.length < 3) {
      errors.subject = "Subject must be at least 3 characters";
    }

    if (trimmedOrderNumber && trimmedOrderNumber.length < 4) {
      errors.orderNumber = "Order number looks too short";
    }

    if (!trimmedMessage) {
      errors.message = "Message is required";
    } else if (trimmedMessage.length < 10) {
      errors.message = "Message must be at least 10 characters";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const newMessage = new Contact({
      fullName: trimmedFullName,
      email: trimmedEmail,
      phone: trimmedPhone,
      subject: trimmedSubject,
      orderNumber: trimmedOrderNumber,
      message: trimmedMessage,
    });

    await newMessage.save();

    return res.status(201).json({
      success: true,
      message:
        "Your message has been sent successfully. Our team will get back to you shortly.",
    });
  } catch (error) {
    console.error("submitContactMessage error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while sending your message.",
    });
  }
};

export { submitContactMessage };