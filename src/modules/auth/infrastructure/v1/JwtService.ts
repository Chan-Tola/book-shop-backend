import jwt from "jsonwebtoken";
import type { StringValue } from "ms";

export class JwtService {
  // Use process.env to grab the secret from your .env file
  private static readonly SECRET = process.env.JWT_SECRET;
  private static readonly EXPIRES_IN: StringValue =
    (process.env.JWT_EXPIRES_IN as StringValue) || "1d";

  static generateToken(payload: { userId: string; role: string }): string {
    return jwt.sign(payload, this.SECRET!, { expiresIn: this.EXPIRES_IN });
  }

  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.SECRET!);
    } catch (error) {
      return null;
    }
  }
}
