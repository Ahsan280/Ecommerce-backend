import { Router } from "express";
import {
  deleteUser,
  getAllUsers,
  loginUser,
  logoutUser,
  makeManager,
  registerUser,
  updateUser,
} from "../controllers/user.controllers.js";
import {
  isAuthenticated,
  isAdmin,
  isAdminOrisOwner,
} from "../middlewares/auth.middleware.js";
const userRouter = Router();

userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/logout").post(isAuthenticated, logoutUser);
userRouter.route("/all-users").get(isAuthenticated, isAdmin, getAllUsers);
userRouter.route("/make-manager").post(isAuthenticated, isAdmin, makeManager);
userRouter
  .route("/update-user")
  .post(isAuthenticated, isAdminOrisOwner, updateUser);
userRouter
  .route("/delete-user")
  .post(isAuthenticated, isAdminOrisOwner, deleteUser);
export default userRouter;
