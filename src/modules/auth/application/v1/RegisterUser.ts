import { UserModel, IUser } from "../../domain/v1/User";
import { PasswordHasher } from "../../infrastructure/v1/PasswordHasher";

export class RegisterUser {
  /**
   * Logic for creating a new user
   */
  async execute(userData: Partial<IUser>) {
    // 1. Check if user already exists
    const existingUser = await UserModel.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // 2. Hash the password
    if (!userData.password) throw new Error("Password is required");
    const hashedPassword = await PasswordHasher.hash(userData.password);

    // 3. Create and Save the user
    const user = new UserModel({
      ...userData,
      password: hashedPassword,
    });

    await user.save();

    // 4. Return the user (Mongoose will hide password due to 'select: false')
    return user;
  }
}
