import { UserModel } from "../../domain/v1/User";
import { PasswordHasher } from "../../infrastructure/v1/PasswordHasher";
import { JwtService } from "../../infrastructure/v1/JwtService";

export class LoginUser {
  async execute(credentials: { email: string; password: string }) {
    // 1. Find user and explicitly include password (because select: false is in Schema)
    const user = await UserModel.findOne({ email: credentials.email }).select(
      "+password",
    );

    if (!user) {
      throw new Error("Invalid email or password");
    }

    // 2. Compare hashed password
    const isMatch = await PasswordHasher.compare(
      credentials.password,
      user.password,
    );
    if (!isMatch) {
      throw new Error("Invalid email or password");
    }

    // 3. Generate the JWT token
    const token = JwtService.generateToken({
      userId: user._id.toString(),
      role: user.role,
    });

    // 4. Prepare user object for response (remove password)
    const { password, ...userObject } = user.toObject();

    return {
      user: userObject,
      token,
    };
  }
}
