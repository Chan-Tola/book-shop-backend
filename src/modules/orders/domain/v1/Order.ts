import { Schema, model, Document, Types } from "mongoose";

export interface IOrderItem {
  bookId: Types.ObjectId;
  title: string;
  quantity: number;
  price: number;
}

export interface IShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export type OrderStatus = "pending" | "processing" | "cancelled" | "completed";
export type PaymentStatus = "pending" | "paid" | "failed";

export interface IOrder extends Document {
  orderNumber: string;
  userId: Types.ObjectId;
  items: IOrderItem[];
  totalPrice: number;
  status: OrderStatus; // "pending" | "processing" | "cancelled"
  shippingAddress: IShippingAddress; // Keep for delivery address
  paymentMethod: string;
  paymentStatus: PaymentStatus; // "pending" | "paid" | "failed"
  createdAt: Date;
  updatedAt: Date;
}

// Order Item Schema
const orderItemSchema = new Schema<IOrderItem>(
  {
    bookId: { type: Schema.Types.ObjectId, ref: "Book", required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  {
    _id: false,
  },
);

// Shipping Address Schema
const shippingAddressSchema = new Schema<IShippingAddress>(
  {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true, default: "United States" },
  },
  { _id: false },
);

// Order Schema
const orderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    items: { type: [orderItemSchema], required: true },
    totalPrice: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "processing", "cancelled", "completed"],
      default: "pending",
      index: true,
    },
    shippingAddress: { type: shippingAddressSchema, required: true },
    paymentMethod: {
      type: String,
      enum: ["stripe", "paypal", "cash_on_delivery"],
      default: "stripe",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  },
);

// Pre-validate middleware to generate order number
orderSchema.pre("validate", function () {
  if (this.isNew && !this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    // Simple and reliable approach: Use timestamp + random
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");

    this.orderNumber = `ORD-${year}${month}${day}-${timestamp}${random}`;
  }
});

export const OrderModel = model<IOrder>("Order", orderSchema);
