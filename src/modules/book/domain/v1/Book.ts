import { Schema, model, Document, Types } from "mongoose";

export interface IBook extends Document {
  title: string;
  author: Types.ObjectId;
  category: Types.ObjectId;
  price: number;
  description?: string;
  images: string[]; // Multiple images array
  stock: number;
  rating: number;
}

const bookSchema = new Schema<IBook>(
  {
    title: { type: String, required: true, trim: true },
    author: { type: Schema.Types.ObjectId, ref: "Author", required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    price: { type: Number, required: true },
    description: { type: String },
    images: {
      type: [String],
    },
    stock: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const BookModel = model<IBook>("Book", bookSchema);
