import axios from "axios";
import mongoose from "mongoose";
import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";

const DELIVERY_FEE = 3000;

const ORDER_STATUSES = {
  PENDING_PAYMENT: "Pending Payment",
  ORDER_PLACED: "Order Placed",
  PAYMENT_CONFIRMED: "Payment Confirmed",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const STATUS_FLOW = {
  [ORDER_STATUSES.PENDING_PAYMENT]: [
    ORDER_STATUSES.PAYMENT_CONFIRMED,
    ORDER_STATUSES.CANCELLED,
  ],
  [ORDER_STATUSES.ORDER_PLACED]: [
    ORDER_STATUSES.PROCESSING,
    ORDER_STATUSES.SHIPPED,
    ORDER_STATUSES.CANCELLED,
  ],
  [ORDER_STATUSES.PAYMENT_CONFIRMED]: [
    ORDER_STATUSES.PROCESSING,
    ORDER_STATUSES.SHIPPED,
    ORDER_STATUSES.CANCELLED,
  ],
  [ORDER_STATUSES.PROCESSING]: [
    ORDER_STATUSES.SHIPPED,
    ORDER_STATUSES.CANCELLED,
  ],
  [ORDER_STATUSES.SHIPPED]: [
    ORDER_STATUSES.OUT_FOR_DELIVERY,
    ORDER_STATUSES.CANCELLED,
  ],
  [ORDER_STATUSES.OUT_FOR_DELIVERY]: [
    ORDER_STATUSES.DELIVERED,
    ORDER_STATUSES.CANCELLED,
  ],
  [ORDER_STATUSES.DELIVERED]: [],
  [ORDER_STATUSES.CANCELLED]: [],
};

const validateAddress = (address = {}) => {
  const requiredFields = [
    "firstName",
    "lastName",
    "email",
    "street",
    "city",
    "state",
    "zipcode",
    "country",
    "phone",
  ];

  for (const field of requiredFields) {
    if (!address[field]?.trim()) {
      return `${field} is required`;
    }
  }

  return "";
};

const buildOrderItemsFromCart = async (cartData) => {
  const items = [];
  let subtotal = 0;

  for (const productId in cartData) {
    if (!mongoose.Types.ObjectId.isValid(productId)) continue;

    const product = await Product.findById(productId);

    if (!product) continue;

    const sizes = cartData[productId];

    for (const size in sizes) {
      const quantity = Number(sizes[size]);

      if (!quantity || quantity <= 0) continue;

      items.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity,
        size,
        image: Array.isArray(product.image) ? product.image[0] : product.image,
      });

      subtotal += product.price * quantity;
    }
  }

  return { items, subtotal };
};

const addTrackingEvent = ({
  order,
  status,
  message,
  location = "",
  updatedBy = "system",
}) => {
  order.trackingHistory.push({
    status,
    message,
    location,
    updatedBy,
    date: new Date(),
  });
};

const getDefaultTrackingMessage = (status) => {
  switch (status) {
    case ORDER_STATUSES.PENDING_PAYMENT:
      return "Waiting for payment confirmation.";
    case ORDER_STATUSES.ORDER_PLACED:
      return "Your order has been placed successfully.";
    case ORDER_STATUSES.PAYMENT_CONFIRMED:
      return "Payment has been confirmed successfully.";
    case ORDER_STATUSES.PROCESSING:
      return "Your order is being prepared for shipment.";
    case ORDER_STATUSES.SHIPPED:
      return "Your order has been shipped.";
    case ORDER_STATUSES.OUT_FOR_DELIVERY:
      return "Your order is out for delivery.";
    case ORDER_STATUSES.DELIVERED:
      return "Your order has been delivered successfully.";
    case ORDER_STATUSES.CANCELLED:
      return "Your order has been cancelled.";
    default:
      return "Order status updated.";
  }
};

const getTrackingSteps = (currentStatus, paymentMethod, payment) => {
  const steps = [
    {
      key: ORDER_STATUSES.ORDER_PLACED,
      label: "Order Placed",
      completed: false,
      active: false,
    },
    {
      key: ORDER_STATUSES.PROCESSING,
      label: "Processing",
      completed: false,
      active: false,
    },
    {
      key: ORDER_STATUSES.SHIPPED,
      label: "Shipped",
      completed: false,
      active: false,
    },
    {
      key: ORDER_STATUSES.OUT_FOR_DELIVERY,
      label: "Out for Delivery",
      completed: false,
      active: false,
    },
    {
      key: ORDER_STATUSES.DELIVERED,
      label: "Delivered",
      completed: false,
      active: false,
    },
  ];

  const statusOrder = [
    ORDER_STATUSES.ORDER_PLACED,
    ORDER_STATUSES.PROCESSING,
    ORDER_STATUSES.SHIPPED,
    ORDER_STATUSES.OUT_FOR_DELIVERY,
    ORDER_STATUSES.DELIVERED,
  ];

  let effectiveStatus = currentStatus;

  if (
    paymentMethod === "PAYSTACK" &&
    !payment &&
    currentStatus === ORDER_STATUSES.PENDING_PAYMENT
  ) {
    effectiveStatus = ORDER_STATUSES.ORDER_PLACED;
  }

  const currentIndex = statusOrder.indexOf(effectiveStatus);

  return steps.map((step, index) => ({
    ...step,
    completed: currentIndex > index,
    active: currentIndex === index,
  }));
};

// ========================= Place Order - COD =========================
const placeOrderCOD = async (req, res) => {
  try {
    const userId = req.user.id;
    const { address } = req.body;

    const addressError = validateAddress(address);
    if (addressError) {
      return res.status(400).json({
        success: false,
        message: addressError,
      });
    }

    const userData = await User.findById(userId);

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const cartData = userData.cartData || {};
    const { items, subtotal } = await buildOrderItemsFromCart(cartData);

    if (!items.length) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    const totalAmount = subtotal + DELIVERY_FEE;

    const newOrder = new Order({
      userId,
      items,
      address,
      amount: totalAmount,
      deliveryFee: DELIVERY_FEE,
      paymentMethod: "COD",
      payment: false,
      status: ORDER_STATUSES.ORDER_PLACED,
      estimatedDeliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      date: Date.now(),
    });

    addTrackingEvent({
      order: newOrder,
      status: ORDER_STATUSES.ORDER_PLACED,
      message: getDefaultTrackingMessage(ORDER_STATUSES.ORDER_PLACED),
      updatedBy: "system",
    });

    await newOrder.save();

    userData.cartData = {};
    userData.markModified("cartData");
    await userData.save();

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
      tracking: {
        orderId: newOrder._id,
        orderNumber: newOrder.orderNumber,
        status: newOrder.status,
        steps: getTrackingSteps(
          newOrder.status,
          newOrder.paymentMethod,
          newOrder.payment
        ),
      },
    });
  } catch (error) {
    console.error("placeOrderCOD error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to place COD order",
    });
  }
};

// ========================= Place Order - Paystack =========================
const placeOrderPaystack = async (req, res) => {
  try {
    const userId = req.user.id;
    const { address } = req.body;

    const addressError = validateAddress(address);
    if (addressError) {
      return res.status(400).json({
        success: false,
        message: addressError,
      });
    }

    const userData = await User.findById(userId);

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const cartData = userData.cartData || {};
    const { items, subtotal } = await buildOrderItemsFromCart(cartData);

    if (!items.length) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    const totalAmount = subtotal + DELIVERY_FEE;
    const reference = `PSK_${Date.now()}_${userId}`;

    const newOrder = new Order({
      userId,
      items,
      address,
      amount: totalAmount,
      deliveryFee: DELIVERY_FEE,
      paymentMethod: "PAYSTACK",
      payment: false,
      status: ORDER_STATUSES.PENDING_PAYMENT,
      paystackReference: reference,
      estimatedDeliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      date: Date.now(),
    });

    addTrackingEvent({
      order: newOrder,
      status: ORDER_STATUSES.PENDING_PAYMENT,
      message: getDefaultTrackingMessage(ORDER_STATUSES.PENDING_PAYMENT),
      updatedBy: "system",
    });

    await newOrder.save();

    const paystackResponse = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email: address.email,
        amount: totalAmount * 100,
        reference,
        callback_url: `${process.env.FRONTEND_URL}/verify-payment`,
        metadata: {
          orderId: newOrder._id.toString(),
          orderNumber: newOrder.orderNumber,
          userId,
          custom_fields: [
            {
              display_name: "Customer Name",
              variable_name: "customer_name",
              value: `${address.firstName} ${address.lastName}`,
            },
            {
              display_name: "Phone Number",
              variable_name: "phone_number",
              value: address.phone,
            },
          ],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const paystackData = paystackResponse.data;

    if (!paystackData.status) {
      return res.status(400).json({
        success: false,
        message: "Unable to initialize Paystack payment",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Paystack payment initialized",
      authorization_url: paystackData.data.authorization_url,
      access_code: paystackData.data.access_code,
      reference: paystackData.data.reference,
      orderId: newOrder._id,
      orderNumber: newOrder.orderNumber,
    });
  } catch (error) {
    console.error(
      "placeOrderPaystack error:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      success: false,
      message:
        error.response?.data?.message || "Unable to initialize Paystack order",
    });
  }
};

// ========================= Verify Paystack Payment =========================
const verifyPaystack = async (req, res) => {
  try {
    const userId = req.user.id;
    const { reference } = req.body;

    if (!reference) {
      return res.status(400).json({
        success: false,
        message: "Payment reference is required",
      });
    }

    const order = await Order.findOne({
      userId,
      paystackReference: reference,
      paymentMethod: "PAYSTACK",
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found for this reference",
      });
    }

    const verifyResponse = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const verifyData = verifyResponse.data;

    if (
      verifyData.status &&
      verifyData.data &&
      verifyData.data.status === "success"
    ) {
      order.payment = true;
      order.status = ORDER_STATUSES.PAYMENT_CONFIRMED;

      addTrackingEvent({
        order,
        status: ORDER_STATUSES.PAYMENT_CONFIRMED,
        message: getDefaultTrackingMessage(ORDER_STATUSES.PAYMENT_CONFIRMED),
        updatedBy: "system",
      });

      await order.save();

      const userData = await User.findById(userId);
      if (userData) {
        userData.cartData = {};
        userData.markModified("cartData");
        await userData.save();
      }

      return res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        order,
        tracking: {
          orderId: order._id,
          orderNumber: order.orderNumber,
          status: order.status,
          steps: getTrackingSteps(order.status, order.paymentMethod, order.payment),
          history: order.trackingHistory,
        },
      });
    }

    return res.status(400).json({
      success: false,
      message: "Payment not successful",
    });
  } catch (error) {
    console.error("verifyPaystack error:", error.response?.data || error.message);

    return res.status(500).json({
      success: false,
      message:
        error.response?.data?.message || "Unable to verify Paystack payment",
    });
  }
};

// ========================= Get User Orders =========================
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    const formattedOrders = orders.map((order) => ({
      ...order,
      trackingSteps: getTrackingSteps(
        order.status,
        order.paymentMethod,
        order.payment
      ),
    }));

    return res.status(200).json({
      success: true,
      orders: formattedOrders,
    });
  } catch (error) {
    console.error("getUserOrders error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch user orders",
    });
  }
};

// ========================= Get Single Order =========================
const getSingleOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order id",
      });
    }

    const order = await Order.findOne({ _id: orderId, userId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      order,
      tracking: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        paymentMethod: order.paymentMethod,
        payment: order.payment,
        estimatedDeliveryDate: order.estimatedDeliveryDate,
        steps: getTrackingSteps(order.status, order.paymentMethod, order.payment),
        history: order.trackingHistory,
      },
    });
  } catch (error) {
    console.error("getSingleOrder error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch order",
    });
  }
};

// ========================= Track Order =========================
const trackOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order id",
      });
    }

    const order = await Order.findOne({ _id: orderId, userId }).lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      tracking: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        currentStatus: order.status,
        paymentMethod: order.paymentMethod,
        payment: order.payment,
        estimatedDeliveryDate: order.estimatedDeliveryDate,
        steps: getTrackingSteps(order.status, order.paymentMethod, order.payment),
        history: order.trackingHistory || [],
      },
    });
  } catch (error) {
    console.error("trackOrder error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to track order",
    });
  }
};

// ========================= All Orders for Admin Panel =========================
const allOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .populate("userId", "name email");

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("allOrders error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

// ========================= Update Order Status for Admin Panel =========================
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status, message, location } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({
        success: false,
        message: "orderId and status are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order id",
      });
    }

    if (!Object.values(ORDER_STATUSES).includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.status === ORDER_STATUSES.DELIVERED) {
      return res.status(400).json({
        success: false,
        message: "Delivered order can no longer be updated",
      });
    }

    if (order.status === ORDER_STATUSES.CANCELLED) {
      return res.status(400).json({
        success: false,
        message: "Cancelled order can no longer be updated",
      });
    }

    const allowedNextStatuses = STATUS_FLOW[order.status] || [];

    if (order.status !== status && !allowedNextStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status transition from "${order.status}" to "${status}"`,
      });
    }

    order.status = status;

    if (status === ORDER_STATUSES.DELIVERED) {
      order.deliveredAt = new Date();
    }

    if (status === ORDER_STATUSES.CANCELLED) {
      order.cancelledAt = new Date();
    }

    addTrackingEvent({
      order,
      status,
      message: message?.trim() || getDefaultTrackingMessage(status),
      location: location?.trim() || "",
      updatedBy: "admin",
    });

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
      tracking: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        currentStatus: order.status,
        steps: getTrackingSteps(order.status, order.paymentMethod, order.payment),
        history: order.trackingHistory,
      },
    });
  } catch (error) {
    console.error("updateOrderStatus error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to update order status",
    });
  }
};

export {
  placeOrderCOD,
  placeOrderPaystack,
  verifyPaystack,
  getUserOrders,
  getSingleOrder,
  trackOrder,
  allOrders,
  updateOrderStatus,
};