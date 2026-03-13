import { Router } from "express";
import { AuthorController } from "../../controllers/v1/AuthorController";
import { protect } from "../../../../../shared/interface/middleware/v1/AuthMiddleware";

const authorRouter = Router();
const controller = new AuthorController();

authorRouter.get("/", controller.getAll);
authorRouter.get("/:id", controller.getById);
authorRouter.post("/", protect, controller.create);
authorRouter.put("/:id", protect, controller.update);
authorRouter.delete("/:id", protect, controller.delete);

export default authorRouter;
