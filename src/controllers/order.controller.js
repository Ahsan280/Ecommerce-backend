import { Order } from "../models/order.model.js"; // Import the Order model
import { Cart } from "../models/cart.model.js"; // Import the Cart model

const createOrder = async (req, res) => {
  try {
    const { userId, shippingAddress } = req.body;
    console.log(userId, shippingAddress);
    // Validate input
    if (!userId || !shippingAddress) {
      console.log("Please select shipping address userid");
      return res
        .status(400)
        .json({ error: "User ID and shipping address are required" });
    }

    // Find the user's cart to get items and total price
    const cart = await Cart.findOne({ user: userId }).populate({
      path: "items",
      populate: { path: "product", model: "Product" },
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: "Cart is empty or not found" });
    }

    // Prepare order items from the cart
    const orderItems = cart.items.map((item) => ({
      cartItem: item._id, // Reference to the CartItem
      quantity: item.quantity,
      price: item.price,
    }));

    // Calculate the total price from cart items
    const totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    // Create the order
    const newOrder = new Order({
      user: userId,
      items: orderItems,
      totalPrice: totalPrice,
      shippingAddress: shippingAddress,
      paymentStatus: "Pending",
    });

    // Save the order to the database
    await newOrder.save();

    return res
      .status(201)
      .json({ order: newOrder, message: "Order created successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
const getOrder = async (req, res) => {
  try {
    console.log("Inside get Orders");
    const { userId } = req.params;
    if (!userId) {
      console.log("Please provide a user ID");
      return res.status(400).json({ error: "User ID is required" });
    }
    const orders = await Order.find({ user: userId }).populate({
      path: "items",

      populate: {
        path: "cartItem",
        model: "CartItem",
        populate: { path: "product", model: "Product" },
      },
    });
    if (!orders) {
      return res.status(404).json({ error: "No orders found for this user" });
    }
    return res.json({ orders, message: "Fetched orders" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
export { createOrder, getOrder };
