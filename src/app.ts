import express, { Application } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { specs } from "./shared/infrastructure/config/swagger";
import rootRouter from "./shared/interface/routes";
import { corsConfig } from "./shared/infrastructure/config/cors.config";

const app: Application = express();

// 1. Standard Middleware
app.use(cors(corsConfig));
app.use(express.json());

// 2. Documentation (Independent of API versioning)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// 3. Centralized Routing with v1 Prefix
app.use("/api/v1", rootRouter);

// 4. Base landing page
app.get("/", (req, res) => {
  res.send("E-commerce Backend (DDD Structure) is active.");
});

export default app;
