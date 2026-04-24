import { Schema, model, Document } from "mongoose";

// TypeScript Interface for Customer (extends User with additional fields)
export interface ICustomer extends Document {
  name: string;
  email: string;
  role: "customer";
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  isActive: boolean;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Address Schema
const addressSchema = new Schema(
  {
    street: { type: String, required: false },
    city: { type: String, required: false },
    state: { type: String, required: false },
    zipCode: { type: String, required: false },
    country: { type: String, required: false, default: "United States" },
  },
  { _id: false },
);

// Customer Schema (extends User with customer-specific fields)
const CustomerSchema = new Schema<ICustomer>(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["customer"],
      default: "customer",
    },
    phone: {
      type: String,
      required: false,
      trim: true,
    },
    address: {
      type: addressSchema,
      required: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    totalOrders: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalSpent: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastOrderDate: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes for performance
CustomerSchema.index({ email: 1 });
CustomerSchema.index({ isActive: 1 });
CustomerSchema.index({ createdAt: -1 });
CustomerSchema.index({ totalSpent: -1 });

// Export the Model
export const CustomerModel = model<ICustomer>("Customer", CustomerSchema);
