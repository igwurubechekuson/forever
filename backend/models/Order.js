import mongoose from "mongoose";

const ORDER_STATUSES = [
  "Pending Payment",
  "Order Placed",
  "Payment Confirmed",
  "Processing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

const trackingEventSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ORDER_STATUSES,
      required: true,
    },
    message: {
      type: String,
      default: "",
      trim: true,
    },
    location: {
      type: String,
      default: "",
      trim: true,
    },
    updatedBy: {
      type: String,
      default: "system",
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    size: { type: String, default: "", trim: true },
    image: { type: String, default: "" },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },

    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: function (value) {
          return Array.isArray(value) && value.length > 0;
        },
        message: "Order items are required",
      },
    },

    address: {
      firstName: { type: String, required: true, trim: true },
      lastName: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true },
      street: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      state: { type: String, required: true, trim: true },
      zipcode: { type: String, required: true, trim: true },
      country: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    deliveryFee: {
      type: Number,
      default: 0,
      min: 0,
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "PAYSTACK"],
      required: true,
    },

    payment: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ORDER_STATUSES,
      default: "Order Placed",
      index: true,
    },

    orderNumber: {
      type: String,
      unique: true,
      index: true,
    },

    trackingHistory: {
      type: [trackingEventSchema],
      default: [],
    },

    estimatedDeliveryDate: {
      type: Date,
      default: null,
    },

    deliveredAt: {
      type: Date,
      default: null,
    },

    cancelledAt: {
      type: Date,
      default: null,
    },

    paystackReference: {
      type: String,
      default: "",
      index: true,
    },

    date: {
      type: Number,
      default: Date.now,
    },
  },
  { timestamps: true }
);

orderSchema.pre("save", function () {
  if (!this.orderNumber) {
    const randomPart = Math.floor(100000 + Math.random() * 900000);
    this.orderNumber = `JM${Date.now()}${randomPart}`;
  }

  if (!this.trackingHistory || this.trackingHistory.length === 0) {
    this.trackingHistory = [
      {
        status: this.status,
        message: "Your order has been created successfully",
        location: "Order System",
        updatedBy: "system",
        date: new Date(),
      },
    ];
  }
});

const Order = mongoose.models.order || mongoose.model("order", orderSchema);

export default Order;