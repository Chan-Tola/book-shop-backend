import { Router } from "express";
import multer from "multer";
import { AuthorController } from "../../controllers/v1/AuthorController";
import { protect } from "../../../../../shared/interface/middleware/v1/AuthMiddleware";
import { requireAdmin } from "../../../../../shared/interface/middleware/v1/rbac";

const authorRouter = Router();
const controller = new AuthorController();
const upload = multer({ storage: multer.memoryStorage() });

// Public routes
authorRouter.get("/", controller.getAll);
authorRouter.get("/:id", controller.getById);

// Admin only routes
authorRouter.post(
  "/",
  protect,
  requireAdmin,
  upload.single("photo"),
  controller.create,
);
authorRouter.put(
  "/:id",
  protect,
  requireAdmin,
  upload.single("photo"),
  controller.update,
);
authorRouter.delete("/:id", protect, requireAdmin, controller.delete);

export default authorRouter;
