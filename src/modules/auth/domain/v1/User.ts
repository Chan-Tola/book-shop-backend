import { Schema, model, Document } from "mongoose";

// TypeScript Interface: Defines how a User looks in our code
export interface IUser extends Document {
  name: string;
  email: string;
  password: string; // We will hash this in the next step
  role: "customer" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose Schema: Defines how a User looks in MongoDB
const UserSchema = new Schema<IUser>(
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
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false, // Crucial: Prevents password from being returned in API calls by default
    },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  },
);

// Export the Model
export const UserModel = model<IUser>("User", UserSchema);
