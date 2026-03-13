import { Schema, model, Document } from "mongoose";

// TypeScript Interface: Defines how a User looks in our code
export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
}

// Mongoose Schema: Defines how a User looks in MongoDB
const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

// Export the Model
export const CategoryModel = model<ICategory>("Category", categorySchema);
