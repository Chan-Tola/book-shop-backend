import { Router } from "express";
import { CategoryController } from "../../controllers/v1/CategoryController";
import { protect } from "../../../../../shared/interface/middleware/v1/AuthMiddleware";

const categoryRouter = Router();
const controller = new CategoryController();

categoryRouter.get("/", controller.getAll); // List all
categoryRouter.get("/:id", controller.getById); // Get single
categoryRouter.post("/", protect, controller.create); // Create (Protected)
categoryRouter.put("/:id", protect, controller.update); // Update (Protected)
categoryRouter.delete("/:id", protect, controller.delete); // Delete (Protected)

export default categoryRouter;
