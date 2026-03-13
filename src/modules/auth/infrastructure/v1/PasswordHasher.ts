import bcrypt from "bcrypt";

export class PasswordHasher {
  private static readonly SALT_ROUNDS = 10;

  /**
   * Converts plain text password into a secure hash
   */
  static async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, this.SALT_ROUNDS);
  }

  /**
   * Compares a plain password with a stored hash (for Login)
   */
  static async compare(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
