import { Schema, model, Document, Types } from "mongoose";

export interface ICartItem {
  bookId: Types.ObjectId;
  quantity: number;
  priceAtAddition: number;
}

export interface ICart extends Document {
  userId: Types.ObjectId;
  items: ICartItem[];
  subTotal: number;
  tax: number;
  totalPrice: number;
}

const cartItemSchema = new Schema<ICartItem>(
  {
    bookId: { type: Schema.Types.ObjectId, ref: "Book", required: true },
    quantity: { type: Number, default: 1, min: 1 },
    priceAtAddition: { type: Number, required: true },
  },
  { _id: false },
);

const cartSchema = new Schema<ICart>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: { type: [cartItemSchema], default: [] },
    subTotal: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    totalPrice: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const CartModel = model<ICart>("Cart", cartSchema);
