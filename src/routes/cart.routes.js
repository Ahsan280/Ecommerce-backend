import {
  addToCart,
  getCart,
  decrementFromCart,
  removeFromCart,
} from "../controllers/cart.controller.js";
import { Router } from "express";

import { isAdmin, isAuthenticated } from "../middlewares/auth.middleware.js";
const cartRouter = Router();
cartRouter.route("/add-to-cart").post(addToCart);
cartRouter.route("/get-cart").get(getCart);
cartRouter.route("/decrement-from-cart").post(decrementFromCart);
cartRouter.route("/remove-from-cart").post(removeFromCart);
export default cartRouter;
