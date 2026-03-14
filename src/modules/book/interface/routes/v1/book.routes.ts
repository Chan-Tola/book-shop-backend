import { Router } from "express";
import multer from "multer";
import { BookController } from "../../controllers/v1/BookController";
import { protect } from "../../../../../shared/interface/middleware/v1/AuthMiddleware";
import { requireAdmin } from "../../../../../shared/interface/middleware/v1/rbac";

const bookRouter = Router();
const controller = new BookController();
const upload = multer({ storage: multer.memoryStorage() });

// Public routes
bookRouter.get("/", controller.getAll);
bookRouter.get("/:id", controller.getById);

// Admin only routes
bookRouter.post(
  "/",
  protect,
  requireAdmin,
  upload.array("images"),
  controller.create,
);
bookRouter.put(
  "/:id",
  protect,
  requireAdmin,
  upload.array("images"),
  controller.update,
);
bookRouter.delete("/:id", protect, requireAdmin, controller.delete);

export default bookRouter;
