import { Schema, model, Document } from "mongoose";

export interface IAuthor extends Document {
  name: string;
  biography?: string;
  photo?: string; // URL to the image
  website?: string;
}

const authorSchema = new Schema<IAuthor>(
  {
    name: { type: String, required: true, trim: true },
    biography: { type: String },
    // Use a generic avatar if no photo is provided
    photo: {
      type: String,
      default: "https://ui-avatars.com/api/?name=Author&background=random",
    },
    website: { type: String },
  },
  { timestamps: true },
);

export const AuthorModel = model<IAuthor>("Author", authorSchema);
