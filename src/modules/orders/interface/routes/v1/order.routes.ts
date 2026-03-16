// backend/src/modules/orders/interface/routes/v1/order.routes.ts
import { Router } from "express";
import { OrderController } from "../../controllers/v1/OrderController";
import { protect } from "../../../../../shared/interface/middleware/v1/AuthMiddleware";
import {
  requireCustomer,
  requireAdmin,
} from "../../../../../shared/interface/middleware/v1/rbac";

const router = Router();
const orderController = new OrderController();

// Customer routes
router.post(
  "/checkout",
  protect,
  requireCustomer,
  orderController.createOrder.bind(orderController),
);
router.get(
  "/my-orders",
  protect,
  requireCustomer,
  orderController.getMyOrders.bind(orderController),
);
router.get(
  "/my-orders/:id",
  protect,
  requireCustomer,
  orderController.getOrderById.bind(orderController),
);
router.delete(
  "/my-orders/:id",
  protect,
  requireCustomer,
  orderController.cancelOrder.bind(orderController),
);

// Admin routes
router.get(
  "/",
  protect,
  requireAdmin,
  orderController.getAllOrders.bind(orderController),
);
router.get(
  "/:id",
  protect,
  requireAdmin,
  orderController.getOrderById.bind(orderController),
);
router.put(
  "/:id/status",
  protect,
  requireAdmin,
  orderController.updateOrderStatus.bind(orderController),
);
router.delete(
  "/:id",
  protect,
  requireAdmin,
  orderController.cancelOrder.bind(orderController),
);

export default router;
