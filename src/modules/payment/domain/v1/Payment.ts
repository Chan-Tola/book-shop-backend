import { Schema, model, Document, Types } from "mongoose";

export type PaymentStatus =
  | "pending"
  | "processing"
  | "succeeded"
  | "failed"
  | "canceled";
export type PaymentIntentStatus =
  | "requires_payment_method"
  | "requires_confirmation"
  | "requires_action"
  | "processing"
  | "succeeded"
  | "canceled"
  | "failed";

export interface IPayment extends Document {
  paymentIntentId: string;
  orderId: Types.ObjectId;
  userId: Types.ObjectId;
  amount: number;
  currency: string;
  status: PaymentStatus;
  stripeStatus: PaymentIntentStatus;
  clientSecret: string;
  metadata: {
    orderNumber: string;
    userId: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IWebhookEvent {
  id: string;
  type: string;
  data: {
    object: any;
  };
  created: number;
  livemode: boolean;
  pending_webhooks: number;
  request: {
    id: string | null;
    idempotency_key: string | null;
  };
}

// Payment Schema
const paymentSchema = new Schema<IPayment>(
  {
    paymentIntentId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
      default: "usd",
    },
    status: {
      type: String,
      enum: ["pending", "processing", "succeeded", "failed", "canceled"],
      default: "pending",
      index: true,
    },
    stripeStatus: {
      type: String,
      enum: [
        "requires_payment_method",
        "requires_confirmation",
        "requires_action",
        "processing",
        "succeeded",
        "canceled",
        "failed",
      ],
      default: "requires_payment_method",
    },
    clientSecret: {
      type: String,
      required: true,
    },
    metadata: {
      orderNumber: { type: String, required: true },
      userId: { type: String, required: true },
    },
  },
  {
    timestamps: true,
  },
);

export const PaymentModel = model<IPayment>("Payment", paymentSchema);
