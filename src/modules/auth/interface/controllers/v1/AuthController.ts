import { Request, Response } from "express";
import { RegisterUser } from "../../../application/v1/RegisterUser";
import { LoginUser } from "../../../application/v1/LoginUser";
import { LogoutUser } from "../../../application/v1/LogoutUser";
import { GetProfile } from "../../../application/v1/GetProfile";

export class AuthController {
  private registerUseCase = new RegisterUser();
  private loginUseCase = new LoginUser();
  private logoutUseCase = new LogoutUser();
  private getProfileUseCase = new GetProfile();

  // Register Method
  register = async (req: Request, res: Response) => {
    try {
      const user = await this.registerUseCase.execute(req.body);
      res.status(201).json({ success: true, data: user });
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message });
    }
  };

  // Login Method
  login = async (req: Request, res: Response) => {
    try {
      const result = await this.loginUseCase.execute(req.body);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      res.status(401).json({ success: false, error: (error as Error).message });
    }
  };

  // Logout Method
  logout = async (req: Request, res: Response) => {
    try {
      const result = await this.logoutUseCase.execute();
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  };

  // Get Profile Method
  getProfile = async (req: Request, res: Response) => {
    try {
      // The 'user' object is attached to 'req' by the AuthMiddleware
      const userId = (req as any).user.userId;
      const user = await this.getProfileUseCase.execute(userId);

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        error: (error as Error).message,
      });
    }
  };
}
