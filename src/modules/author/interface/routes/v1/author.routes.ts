import { Router } from "express";
import multer from "multer";
import { AuthorController } from "../../controllers/v1/AuthorController";
import { protect } from "../../../../../shared/interface/middleware/v1/AuthMiddleware";

const authorRouter = Router();
const controller = new AuthorController();
const upload = multer({ storage: multer.memoryStorage() });

authorRouter.get("/", controller.getAll);
authorRouter.get("/:id", controller.getById);
authorRouter.post("/", protect, upload.single("photo"), controller.create);
authorRouter.put("/:id", protect, upload.single("photo"), controller.update);
authorRouter.delete("/:id", protect, controller.delete);

export default authorRouter;
