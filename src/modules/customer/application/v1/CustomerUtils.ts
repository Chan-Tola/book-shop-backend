import { UserModel } from "../../../auth/domain/v1/User";

// Utility functions for customer management
export class CustomerUtils {
  // Get customer by email
  static async getCustomerByEmail(email: string) {
    return await UserModel.findOne({
      email: email.toLowerCase().trim(),
      role: "customer",
    }).select("-password");
  }

  // Search customers by name or email
  static async searchCustomers(query: string, limit: number = 10) {
    const regex = new RegExp(query, "i"); // Case-insensitive search
    return await UserModel.find({
      role: "customer",
      $or: [{ name: { $regex: regex } }, { email: { $regex: regex } }],
    })
      .select("-password")
      .limit(limit)
      .sort({ name: 1 });
  }

  // Get all customers (sorted by creation date)
  static async getTopCustomers(limit: number = 10) {
    return await UserModel.find({
      role: "customer",
    })
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(limit);
  }
}
