import { Router } from "express";
import { CartController } from "../../Controllers/v1/CartController";
import { protect } from "../../../../../shared/interface/middleware/v1/AuthMiddleware";

const router = Router();
const controller = new CartController();

// Public routes
router.get("/", protect, (req, res) => controller.getMyCart(req, res));
router.post("/add", protect, (req, res) => controller.addToCart(req, res));
router.put("/update", protect, (req, res) => controller.updateItem(req, res));
router.delete("/remove/:bookId", protect, (req, res) =>
  controller.removeItem(req, res),
);
router.delete("/clear", protect, (req, res) => controller.clearCart(req, res));

// Admin only routes
// Admin analytics route (optional) future
export default router;
