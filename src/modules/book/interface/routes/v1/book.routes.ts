import { Router } from "express";
import multer from "multer";
import { BookController } from "../../controllers/v1/BookController";
import { protect } from "../../../../../shared/interface/middleware/v1/AuthMiddleware";

const bookRouter = Router();
const controller = new BookController();
const upload = multer({ storage: multer.memoryStorage() });

bookRouter.get("/", controller.getAll);
bookRouter.get("/:id", controller.getById);
bookRouter.post("/", protect, upload.array("images"), controller.create);
bookRouter.put("/:id", protect, upload.array("images"), controller.update);
bookRouter.delete("/:id", protect, controller.delete);

export default bookRouter;
