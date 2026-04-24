import { Router } from "express";
import { uploadFileToR2 } from "../../infrastructure/services/R2StorageService";
import authRoutes from "../../../modules/auth/interface/routes/v1/auth.routes";
import categoryRoutes from "../../../modules/category/interface/routes/v1/category.routes";
import authorRoutes from "../../../modules/author/interface/routes/v1/author.routes";
import bookRoutes from "../../../modules/book/interface/routes/v1/book.routes";
import cartRoutes from "../../../modules/cart/interface/routes/v1/cart.routes";
import orderRoutes from "../../../modules/orders/interface/routes/v1/order.routes";
import paymentRoutes from "../../../modules/payment/interface/routes/v1/payment.routes";
import customerRoutes from "../../../modules/customer/interface/routes/v1/customer.routes";

const rootRouter = Router();

// --- System & Infrastructure Routes ---

rootRouter.get("/health", (req, res) => {
  res.json({ status: "ok", version: "v1" });
});

rootRouter.get("/test-r2", async (req, res) => {
  try {
    const testContent = Buffer.from("Hello Cloudflare R2! Test upload.");
    const fileName = `test-${Date.now()}.txt`;
    const url = await uploadFileToR2(testContent, fileName, "text/plain");
    res.json({ success: true, url });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// --- Domain Modules (Add these as you build them) ---
rootRouter.use("/auth", authRoutes);
rootRouter.use("/categories", categoryRoutes);
rootRouter.use("/authors", authorRoutes);
rootRouter.use("/books", bookRoutes);
rootRouter.use("/carts", cartRoutes);
rootRouter.use("/orders", orderRoutes);
rootRouter.use("/payments", paymentRoutes);
rootRouter.use("/customers", customerRoutes);

export default rootRouter;
