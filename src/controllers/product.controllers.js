import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { Product } from "../models/product.model.js";
const createProduct = async (req, res) => {
  const { name, description, price, category } = req.body;
  const productImageLocalPath = req.file?.path;
  if (!name || !description || !price) {
    return res.status(400).json({ error: "All fields are required" });
  }
  const productImage = await uploadOnCloudinary(productImageLocalPath);
  const product = await Product.create({
    name,
    description,
    price,
    category,
    image: productImage.url,
  });
  if (!product) {
    return res.status(500).json({ error: "Failed to create product" });
  }
  res.status(201).json({ product, message: "Product created successfully" });
};
const getAllProducts = async (req, res) => {
  const products = await Product.find({});

  if (!products) {
    return res.status(404).json({ error: "No products found" });
  }
  res.json({ products, message: "Fetched products" });
};
const getProductDetails = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" });
    }
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ product, message: "Product fetched" });
  } catch (error) {}
};
const updateProduct = async (req, res, next) => {
  try {
    const { id, name, description, price, category } = req.body;
    if (!name || !description || !price || !category) {
      return res.status(400).json({ error: "Product data is required" });
    }
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { description, name, price, category },

      { new: true }
    );
    if (req.file) {
      return next();
    }
    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ product: updatedProduct, message: "Product updated" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to update product" });
  }
};
const updateProductImage = async (req, res) => {
  try {
    const { id } = req.body;
    const updatedProduct = await Product.findById(id);
    await deleteFromCloudinary(updatedProduct.image);
    const productImageLocalPath = req.file?.path;
    const productImage = await uploadOnCloudinary(productImageLocalPath);
    updatedProduct.image = productImage.url;
    await updatedProduct.save({ validateBeforeSave: false });

    return res.json({
      product: updateProduct,
      message: "Product image updated successfully",
    });
  } catch (error) {
    console.error("In updateImage", error);
    return res.status(500).json({ error: "Failed to update product image" });
  }
};
const deleteProduct = async (req, res) => {
  const { productId } = req.body;
  console.log("Inside deleteProduct", productId);

  if (!productId) {
    return res.status(404).json({ error: "Product not found" });
  }
  const product = await Product.findByIdAndDelete(productId);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  res.status(200).json({
    product,
    message: "Product deleted successfully",
  });
};

export {
  createProduct,
  getAllProducts,
  getProductDetails,
  updateProduct,
  updateProductImage,
  deleteProduct,
};
