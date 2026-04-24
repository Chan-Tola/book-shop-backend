// backend/src/modules/orders/interface/controllers/v1/OrderController.ts
import { Request, Response } from "express";
import { AuthenticatedRequest } from "../../../../../shared/interface/middleware/v1/rbac";
import {
  CreateOrder,
  GetMyOrders,
  GetOrderById,
  GetAllOrders,
  UpdateOrderStatus,
  CancelOrder,
  CreateOrderData,
  PaginationOptions,
} from "../../../application/v1/OrderServices";
import { OrderStatus } from "../../../domain/v1/Order";

export class OrderController {
  private createOrderService = new CreateOrder();
  private getMyOrdersService = new GetMyOrders();
  private getOrderByIdService = new GetOrderById();
  private getAllOrdersService = new GetAllOrders();
  private updateOrderStatusService = new UpdateOrderStatus();
  private cancelOrderService = new CancelOrder();

  // Customer: Create order from cart
  async createOrder(req: AuthenticatedRequest, res: Response) {
    try {
      const { shippingAddress } = req.body;
      const userId = req.user!.userId;

      if (!shippingAddress) {
        return res.status(400).json({
          success: false,
          message: "Shipping address is required",
        });
      }

      // Validate shipping address
      const requiredFields = ["street", "city", "state", "zipCode", "country"];
      const missingFields = requiredFields.filter(
        (field) => !shippingAddress[field],
      );

      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Missing required fields: ${missingFields.join(", ")}`,
        });
      }

      const order = await this.createOrderService.execute({
        userId,
        shippingAddress,
      });

      res.status(201).json({
        success: true,
        message: "Order created successfully",
        data: order,
      });
    } catch (error: any) {
      console.error("Create order error:", error);
      res.status(400).json({
        success: false,
        message: error.message || "Failed to create order",
      });
    }
  }

  // Customer: Get own orders
  async getMyOrders(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const {
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = req.query;

      const options: PaginationOptions = {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        sortBy: sortBy as string,
        sortOrder: sortOrder as "asc" | "desc",
      };

      const result = await this.getMyOrdersService.execute(userId, options);

      res.status(200).json({
        success: true,
        message: "Orders retrieved successfully",
        data: result,
      });
    } catch (error: any) {
      console.error("Get my orders error:", error);
      res.status(400).json({
        success: false,
        message: error.message || "Failed to retrieve orders",
      });
    }
  }

  // Get order by ID (customer or admin)
  async getOrderById(req: AuthenticatedRequest, res: Response) {
    try {
      const id = req.params.id;
      if (typeof id !== "string") {
        return res.status(400).json({
          success: false,
          message: "Order id is required",
        });
      }
      const userId = req.user!.userId;
      const userRole = req.user!.role;

      // Admin can view any order, customer can only view their own
      const orderUserId = userRole === "admin" ? undefined : userId;

      const order = await this.getOrderByIdService.execute(id, orderUserId);

      res.status(200).json({
        success: true,
        message: "Order retrieved successfully",
        data: order,
      });
    } catch (error: any) {
      console.error("Get order by ID error:", error);
      res.status(404).json({
        success: false,
        message: error.message || "Order not found",
      });
    }
  }

  // Admin: Get all orders
  async getAllOrders(req: AuthenticatedRequest, res: Response) {
    try {
      const {
        page = 1,
        limit = 20,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = req.query;

      const options: PaginationOptions = {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        sortBy: sortBy as string,
        sortOrder: sortOrder as "asc" | "desc",
      };

      const result = await this.getAllOrdersService.execute(options);

      res.status(200).json({
        success: true,
        message: "All orders retrieved successfully",
        data: result,
      });
    } catch (error: any) {
      console.error("Get all orders error:", error);
      res.status(400).json({
        success: false,
        message: error.message || "Failed to retrieve orders",
      });
    }
  }

  // Admin: Update order status
  async updateOrderStatus(req: AuthenticatedRequest, res: Response) {
    try {
      const id = req.params.id;
      const status = req.body.status;

      if (typeof id !== "string") {
        return res.status(400).json({
          success: false,
          message: "Order id is required",
        });
      }

      if (typeof status !== "string") {
        return res.status(400).json({
          success: false,
          message: "Status is required",
        });
      }

      const statusValue = status as OrderStatus;
      const validStatuses = [
        "pending",
        "processing",
        "cancelled",
        "completed",
      ] as const;
      if (!validStatuses.includes(statusValue)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status",
        });
      }

      const order = await this.updateOrderStatusService.execute(
        id,
        statusValue,
      );

      res.status(200).json({
        success: true,
        message: "Order status updated successfully",
        data: order,
      });
    } catch (error: any) {
      console.error("Update order status error:", error);
      res.status(400).json({
        success: false,
        message: error.message || "Failed to update order status",
      });
    }
  }

  // Cancel order (customer or admin)
  async cancelOrder(req: AuthenticatedRequest, res: Response) {
    try {
      const id = req.params.id;
      if (typeof id !== "string") {
        return res.status(400).json({
          success: false,
          message: "Order id is required",
        });
      }
      const userId = req.user!.userId;
      const userRole = req.user!.role;

      // Admin can cancel any order, customer can only cancel their own
      const orderUserId = userRole === "admin" ? undefined : userId;

      const order = await this.cancelOrderService.execute(id, orderUserId);

      res.status(200).json({
        success: true,
        message: "Order cancelled successfully",
        data: order,
      });
    } catch (error: any) {
      console.error("Cancel order error:", error);
      res.status(400).json({
        success: false,
        message: error.message || "Failed to cancel order",
      });
    }
  }
}
