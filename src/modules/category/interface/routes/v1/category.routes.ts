import { Router } from "express";
import { CategoryController } from "../../controllers/v1/CategoryController";
import { protect } from "../../../../../shared/interface/middleware/v1/AuthMiddleware";
import { requireAdmin } from "../../../../../shared/interface/middleware/v1/rbac";

const categoryRouter = Router();
const controller = new CategoryController();

// Public routes
categoryRouter.get("/", controller.getAll);
categoryRouter.get("/:id", controller.getById);

// Admin only routes
categoryRouter.post("/", protect, requireAdmin, controller.create);
categoryRouter.put("/:id", protect, requireAdmin, controller.update);
categoryRouter.delete("/:id", protect, requireAdmin, controller.delete);

export default categoryRouter;
