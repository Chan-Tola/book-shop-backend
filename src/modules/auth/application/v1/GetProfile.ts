import { UserModel } from "../../domain/v1/User";

export class GetProfile {
  async execute(userId: string) {
    const user = await UserModel.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }
}
