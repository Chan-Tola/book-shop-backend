import { Request, Response, NextFunction } from "express";
import { JwtService } from "../../../../modules/auth/infrastructure/v1/JwtService";
import { AuthenticatedRequest } from "./rbac";

export const protect = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  let token;

  // Get token from Headers (Standard: Bearer <token>)
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Access denied. No token provided." });
  }

  try {
    // Verify Token
    const decoded = JwtService.verifyToken(token);
    if (!decoded) throw new Error();

    // Attach user data with proper structure
    req.user = {
      userId: decoded.userId || decoded.id,
      email: decoded.email,
      role: decoded.role || "customer", // Default to customer if not specified
    };

    next();
  } catch (error) {
    res
      .status(401)
      .json({ success: false, message: "Invalid or expired token." });
  }
};
