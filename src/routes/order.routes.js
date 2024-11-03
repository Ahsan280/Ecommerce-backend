import { Router } from "express";
import { isAdmin, isAuthenticated } from "../middlewares/auth.middleware.js";
import { createOrder, getOrder } from "../controllers/order.controller.js";
const orderRouter = Router();
orderRouter.route("/create-order").post(isAuthenticated, createOrder);
orderRouter.route("/get-orders/:userId").get(isAuthenticated, getOrder);
export default orderRouter;
