import { Router } from "express";
import { isAdmin, isAuthenticated } from "../middlewares/auth.middleware.js";
import {
  createCheckoutSession,
  sessionStatus,
} from "../controllers/payment.controller.js";
const paymentRouter = Router();
paymentRouter
  .route("/create-checkout-session")
  .post(isAuthenticated, createCheckoutSession);
paymentRouter.route("/session-status").get(isAuthenticated, sessionStatus);
export default paymentRouter;
