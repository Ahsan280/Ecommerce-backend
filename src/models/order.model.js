import mongoose, { Schema } from "mongoose";
import { CartItem } from "./cart.model.js"; // Assuming CartItem is defined elsewhere

const orderItemSchema = new Schema({
  cartItem: {
    type: Schema.Types.ObjectId,
    ref: "CartItem",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema],
    totalPrice: {
      type: Number,
      required: true,
    },
    shippingAddress: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);
export const OrderItem = mongoose.model("OrderItem", orderItemSchema);
export const Order = mongoose.model("Order", orderSchema);
