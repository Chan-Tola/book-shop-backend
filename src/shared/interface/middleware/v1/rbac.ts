import { Request, Response, NextFunction } from "express";

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: "customer" | "admin";
  };
}

export const rbac = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
        error: "Please login to access this resource",
      });
    }

    // Check if user has required role
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to access.",
        error: `Access denied. Required roles: ${allowedRoles.join(", ")}. Current role: ${req.user.role}`,
      });
    }

    next();
  };
};

// Convenience middleware functions
export const requireAdmin = rbac(["admin"]);
export const requireCustomer = rbac(["customer"]);
export const requireAny = rbac(["customer", "admin"]);

// Role-based access control for specific operations
export const requireOwnership = (resourceIdParam: string = "id") => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Admin can access any resource
    if (req.user.role === "admin") {
      return next();
    }

    // Customer can only access their own resources
    const resourceOwnerId = req.params[resourceIdParam];
    const userId = req.user.userId;

    if (resourceOwnerId !== userId) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to access.",
        error: "You can only access your own resources",
      });
    }

    next();
  };
};
