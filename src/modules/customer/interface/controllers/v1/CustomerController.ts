import { Request, Response } from "express";
import {
  GetAllCustomers,
  GetCustomerById,
  CreateCustomer,
  UpdateCustomer,
  DeleteCustomer,
  GetCustomerStats,
  PaginationOptions,
} from "../../../application/v1/CustomerService";

export class CustomerController {
  private getAllCustomersUC = new GetAllCustomers();
  private getCustomerByIdUC = new GetCustomerById();
  private createCustomerUC = new CreateCustomer();
  private updateCustomerUC = new UpdateCustomer();
  private deleteCustomerUC = new DeleteCustomer();
  private getCustomerStatsUC = new GetCustomerStats();

  // GET ALL CUSTOMERS (Admin only)
  getAll = async (req: Request, res: Response) => {
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

      const result = await this.getAllCustomersUC.execute(options);
      res.status(200).json({
        success: true,
        message: "Customers retrieved successfully",
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: (error as Error).message,
      });
    }
  };

  // GET CUSTOMER BY ID (Admin only)
  getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id || Array.isArray(id)) {
        return res
          .status(400)
          .json({ success: false, error: "Invalid customer id" });
      }

      const customer = await this.getCustomerByIdUC.execute(id);
      res.status(200).json({
        success: true,
        message: "Customer retrieved successfully",
        data: customer,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        error: (error as Error).message,
      });
    }
  };

  // CREATE CUSTOMER (Admin only)
  create = async (req: Request, res: Response) => {
    try {
      const customer = await this.createCustomerUC.execute(req.body);
      res.status(201).json({
        success: true,
        message: "Customer created successfully",
        data: customer,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: (error as Error).message,
      });
    }
  };

  // UPDATE CUSTOMER (Admin only)
  update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id || Array.isArray(id)) {
        return res
          .status(400)
          .json({ success: false, error: "Invalid customer id" });
      }

      const result = await this.updateCustomerUC.execute(id, req.body);
      res.status(200).json({
        success: true,
        message: "Customer updated successfully",
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: (error as Error).message,
      });
    }
  };

  // DELETE CUSTOMER (Admin only)
  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id || Array.isArray(id)) {
        return res
          .status(400)
          .json({ success: false, error: "Invalid customer id" });
      }

      const result = await this.deleteCustomerUC.execute(id);
      res.status(200).json({
        success: true,
        message: "Customer deleted successfully",
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: (error as Error).message,
      });
    }
  };

  // GET CUSTOMER STATISTICS (Admin only)
  getStats = async (req: Request, res: Response) => {
    try {
      const stats = await this.getCustomerStatsUC.execute();
      res.status(200).json({
        success: true,
        message: "Customer statistics retrieved successfully",
        data: stats,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: (error as Error).message,
      });
    }
  };
}
