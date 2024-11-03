import { Cart, CartItem } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";

const addToCart = async (req, res) => {
  try {
    const { cartId, userId, product, quantity } = req.body;

    if (!product || !quantity) {
      console.log(product, quantity);
      console.log("Product and quantity are required");
      return res
        .status(400)
        .json({ error: "Product and quantity are required" });
    }

    // Check if the product exists and get its price
    const productData = await Product.findById(product);
    if (!productData) {
      console.log("Product not found data");
      return res.status(404).json({ error: "Product not found" });
    }

    // Create a new CartItem
    const cartItem = await CartItem.create({
      product: productData._id,
      quantity,
      price: productData.price * quantity,
    });

    let cart;

    if (!cartId) {
      // No cart exists, create a new one
      cart = await Cart.create({
        items: [cartItem._id],
        user: userId || null,
        totalPrice: cartItem.price,
      });
    } else {
      // Cart exists, find and update it
      cart = userId
        ? await Cart.findOne({ user: userId })
        : await Cart.findById(cartId);

      if (!cart) {
        console.log("Cart not found");
        return res.status(404).json({ error: "Cart not found" });
      }

      // Check if item already exists in the cart
      const existingCartItem = await CartItem.findOne({
        product: productData._id,
        _id: { $in: cart.items },
      });

      if (existingCartItem) {
        existingCartItem.quantity += quantity;
        existingCartItem.price += productData.price * quantity;
        await existingCartItem.save();
      } else {
        cart.items.push(cartItem._id);
      }

      // Update total price
      cart.totalPrice += productData.price * quantity;
      await cart.save();
    }

    // Populate items and products
    const populatedCart = await Cart.findById(cart._id).populate({
      path: "items",
      populate: {
        path: "product",
        model: "Product",
      },
    });

    return res.json({ cart: populatedCart, message: "Item added to cart" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
const getCart = async (req, res) => {
  try {
    const { cartId, userId } = req.query;

    if (!cartId && !userId) {
      return res
        .status(200)
        .json({ cart: null, error: "Cart ID or User ID is required" });
    }
    let cart;
    if (userId) {
      cart = await Cart.findOne({
        $or: [{ _id: cartId }, { user: userId ? userId : "" }],
      }).populate({
        path: "items",
        populate: { path: "product", model: "Product" },
      });
    } else if (cartId) {
      cart = await Cart.findOne({ _id: cartId }).populate({
        path: "items",
        populate: { path: "product", model: "Product" },
      });
    }

    if (!cart) {
      return res.status(404).json({ cart: null, error: "No cart found" });
    }
    return res.json({ cart, message: "Cart fetched" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const decrementFromCart = async (req, res) => {
  try {
    const { cartId, userId, itemId } = req.body;
    const cartItem = await CartItem.findById(itemId).populate("product");

    if (cartItem.quantity > 1) {
      cartItem.quantity -= 1;
      cartItem.price -= cartItem.product.price; // Update price based on product price
      await cartItem.save({ validateBeforeSave: false });
    } else {
      await CartItem.findByIdAndDelete(itemId);
    }

    // Retrieve the updated cart
    let cart;
    if (userId) {
      cart = await Cart.findOne({ user: userId }).populate({
        path: "items",
        populate: { path: "product", model: "Product" },
      });
    } else {
      cart = await Cart.findById(cartId).populate({
        path: "items",
        populate: { path: "product", model: "Product" },
      });
    }

    // Calculate the total price of the cart
    const totalPrice = cart.items.reduce((sum, item) => {
      return sum + item.quantity * item.product.price;
    }, 0);

    // Update and save the cart's total price
    cart.totalPrice = totalPrice;
    await cart.save();

    return res.json({
      cart,
      message: "Item quantity decremented in cart",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
const removeFromCart = async (req, res) => {
  try {
    const { cartId, userId, itemId } = req.body;

    await CartItem.findByIdAndDelete(itemId);

    // Retrieve the updated cart
    let cart;
    if (userId) {
      cart = await Cart.findOne({ user: userId }).populate({
        path: "items",
        populate: { path: "product", model: "Product" },
      });
    } else {
      cart = await Cart.findById(cartId).populate({
        path: "items",
        populate: { path: "product", model: "Product" },
      });
    }

    // Calculate the total price of the cart
    const totalPrice = cart.items.reduce((sum, item) => {
      return sum + item.quantity * item.product.price;
    }, 0);

    // Update and save the cart's total price
    cart.totalPrice = totalPrice;
    await cart.save();

    return res.json({
      cart,
      message: "Item quantity decremented in cart",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export { addToCart, getCart, decrementFromCart, removeFromCart };
