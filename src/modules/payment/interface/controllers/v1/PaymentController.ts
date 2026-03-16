import { Response } from "express";
import { AuthenticatedRequest } from "../../../../../shared/interface/middleware/v1/rbac";
import {
  CreatePaymentIntent,
  ConfirmPayment,
  GetPaymentByOrderId,
  StripeHealthCheck,
} from "../../../application/v1/PaymentServices";

export class PaymentController {
  private createPaymentIntentService = new CreatePaymentIntent();
  private confirmPaymentService = new ConfirmPayment();
  private getPaymentByOrderIdService = new GetPaymentByOrderId();
  private stripeHealthCheckService = new StripeHealthCheck();

  // Customer: Create payment intent
  async createPaymentIntent(req: AuthenticatedRequest, res: Response) {
    try {
      const orderId = req.body.orderId;
      const userId = req.user!.userId;

      if (typeof orderId !== "string") {
        return res.status(400).json({
          success: false,
          message: "Order id is required",
        });
      }

      const result = await this.createPaymentIntentService.execute({
        orderId,
        userId,
      });

      res.status(201).json({
        success: true,
        message: "Payment intent created",
        data: {
          paymentIntentId: result.paymentIntent.id,
          clientSecret: result.clientSecret,
          amount: result.paymentIntent.amount,
          currency: result.paymentIntent.currency,
          status: result.paymentIntent.status,
          payment: result.payment,
        },
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to create payment intent",
      });
    }
  }

  // Customer: Confirm payment intent (after client confirmation)
  async confirmPayment(req: AuthenticatedRequest, res: Response) {
    try {
      const paymentIntentId = req.body.paymentIntentId;
      const userId = req.user!.userId;

      if (typeof paymentIntentId !== "string") {
        return res.status(400).json({
          success: false,
          message: "Payment intent id is required",
        });
      }

      const result = await this.confirmPaymentService.execute({
        paymentIntentId,
        userId,
      });

      res.status(200).json({
        success: true,
        message: "Payment status updated",
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to confirm payment",
      });
    }
  }

  // Customer/Admin: Get payment by order id
  async getPaymentByOrderId(req: AuthenticatedRequest, res: Response) {
    try {
      const orderId = req.params.orderId;
      const userId = req.user!.userId;
      const userRole = req.user!.role;

      if (typeof orderId !== "string") {
        return res.status(400).json({
          success: false,
          message: "Order id is required",
        });
      }

      const payment = await this.getPaymentByOrderIdService.execute(
        orderId,
        userRole === "admin" ? undefined : userId,
      );

      res.status(200).json({
        success: true,
        message: "Payment retrieved",
        data: payment,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || "Payment not found",
      });
    }
  }

  async stripeHealthCheck(req: AuthenticatedRequest, res: Response) {
    try {
      const result = await this.stripeHealthCheckService.execute();
      res.status(200).json({
        success: true,
        message: "Stripe connection ok",
        data: result,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Stripe connection failed",
      });
    }
  }
}
