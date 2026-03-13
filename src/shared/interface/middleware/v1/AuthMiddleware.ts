import { Request, Response, NextFunction } from "express";
import { JwtService } from "../../../../modules/auth/infrastructure/v1/JwtService";

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let token;

  // 1. Get token from Headers (Standard: Bearer <token>)
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Access denied. No token provided." });
  }

  try {
    // 2. Verify Token
    const decoded = JwtService.verifyToken(token);
    if (!decoded) throw new Error();

    // 3. Attach user data to the request so the next function knows who this is
    (req as any).user = decoded;

    next();
  } catch (error) {
    res
      .status(401)
      .json({ success: false, message: "Invalid or expired token." });
  }
};
