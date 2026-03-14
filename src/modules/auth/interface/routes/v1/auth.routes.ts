import { Router } from "express";
import { AuthController } from "../../controllers/v1/AuthController";
import { protect } from "../../../../../shared/interface/middleware/v1/AuthMiddleware";
import {
  requireAny,
  requireAdmin,
} from "../../../../../shared/interface/middleware/v1/rbac";

const authRouter = Router();
const authController = new AuthController();

// Public routes
authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);

// Admin only routes
authRouter.post("/logout", protect, requireAny, authController.logout);
authRouter.get("/me", protect, requireAny, authController.getProfile);

// Admin only routes in the future
// authRouter.get(
//   "/admin/users",
//   protect,
//   requireAdmin,
//   authController.getAllUsers,
// );
// authRouter.get(
//   "/admin/users/:id",
//   protect,
//   requireAdmin,
//   authController.getUserById,
// );
// authRouter.put(
//   "/admin/users/:id/role",
//   protect,
//   requireAdmin,
//   authController.updateUserRole,
// );
// authRouter.delete(
//   "/admin/users/:id",
//   protect,
//   requireAdmin,
//   authController.deleteUser,
// );
export default authRouter;
