import { Router } from "express";
import { PaymentController } from "../../controllers/v1/PaymentController";
import { protect } from "../../../../../shared/interface/middleware/v1/AuthMiddleware";
import {
  requireAdmin,
  requireCustomer,
  requireAny,
} from "../../../../../shared/interface/middleware/v1/rbac";

const paymentRouter = Router();
const controller = new PaymentController();

// Admin: Stripe connection health check
paymentRouter.get(
  "/stripe-health",
  protect,
  requireAdmin,
  controller.stripeHealthCheck.bind(controller),
);

// Customer: Create payment intent
paymentRouter.post(
  "/intent",
  protect,
  requireCustomer,
  controller.createPaymentIntent.bind(controller),
);

// Customer: Confirm payment
paymentRouter.post(
  "/confirm",
  protect,
  requireCustomer,
  controller.confirmPayment.bind(controller),
);

// Customer/Admin: Get payment by order id
paymentRouter.get(
  "/order/:orderId",
  protect,
  requireAny,
  controller.getPaymentByOrderId.bind(controller),
);

export default paymentRouter;
