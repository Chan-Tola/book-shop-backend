import { Router } from "express";
import { AuthController } from "../../controllers/v1/AuthController";
import { protect } from "../../../../../shared/interface/middleware/v1/AuthMiddleware";

const authRouter = Router();
const authController = new AuthController();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.post("/logout", authController.logout);

// NEW: Protected Profile Route
authRouter.get("/me", protect, authController.getProfile);

export default authRouter;
