import { UserModel, IUser } from "../../../auth/domain/v1/User";
import { OrderModel } from "../../../orders/domain/v1/Order";

// Pagination options
export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedCustomers {
  customers: IUser[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCustomers: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// Get all customers with pagination and filtering
export class GetAllCustomers {
  async execute(options: PaginationOptions = {}): Promise<PaginatedCustomers> {
    const {
      page = 1,
      limit = 20,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = options;

    const skip = (page - 1) * limit;

    const customers = await UserModel.find({ role: "customer" })
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .select("-password"); // Exclude password field

    const totalCustomers = await UserModel.countDocuments({
      role: "customer",
    });

    return {
      customers,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCustomers / limit),
        totalCustomers,
        hasNextPage: page < Math.ceil(totalCustomers / limit),
        hasPrevPage: page > 1,
      },
    };
  }
}

// Get customer by ID
export class GetCustomerById {
  async execute(id: string): Promise<IUser> {
    const customer = await UserModel.findOne({
      _id: id,
      role: "customer",
    }).select("-password");

    if (!customer) {
      throw new Error("Customer not found");
    }

    return customer;
  }
}

// Create customer (registration)
export class CreateCustomer {
  async execute(customerData: Partial<IUser>): Promise<IUser> {
    const customer = new UserModel({
      ...customerData,
      role: "customer",
    });

    return await customer.save();
  }
}

// Update customer
export class UpdateCustomer {
  async execute(id: string, updateData: Partial<IUser>): Promise<IUser> {
    const customer = await UserModel.findOneAndUpdate(
      { _id: id, role: "customer" },
      updateData,
      { new: true, runValidators: true },
    ).select("-password");

    if (!customer) {
      throw new Error("Customer not found");
    }

    return customer;
  }
}

// Delete customer (hard delete since User model doesn't have isActive)
export class DeleteCustomer {
  async execute(id: string): Promise<IUser> {
    const customer = await UserModel.findOneAndDelete({
      _id: id,
      role: "customer",
    }).select("-password");

    if (!customer) {
      throw new Error("Customer not found");
    }

    return customer;
  }
}

// Get customer statistics
export class GetCustomerStats {
  async execute(): Promise<{
    totalCustomers: number;
    activeCustomers: number;
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
  }> {
    // Get total customers
    const totalCustomers = await UserModel.countDocuments({ role: "customer" });

    // For now, return basic stats since User model doesn't have order data
    // This will be enhanced when we integrate with Order system
    return {
      totalCustomers,
      activeCustomers: totalCustomers, // All users are considered active
      totalOrders: 0, // Will be calculated from Order model
      totalRevenue: 0, // Will be calculated from Order model
      averageOrderValue: 0,
    };
  }
}

// Note: UpdateCustomerOrderStats is not available with User model
// Order statistics will need to be calculated from Order model directly
// This functionality can be added later when we integrate order system
