import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductDetails,
  updateProduct,
  updateProductImage,
} from "../controllers/product.controllers.js";
import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { isAdmin, isAuthenticated } from "../middlewares/auth.middleware.js";

const productRouter = Router();
productRouter
  .route("/create-product")
  .post(isAuthenticated, isAdmin, upload.single("image"), createProduct);
productRouter.route("/get-all-products").get(getAllProducts);
productRouter.route("/product-details/:productId").get(getProductDetails);
productRouter
  .route("/update-product")
  .post(upload.single("image"), updateProduct, updateProductImage);
productRouter.route("/delete-product").post(deleteProduct);
export default productRouter;
