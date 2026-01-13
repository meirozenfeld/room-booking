import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./auth-middleware";

/**
 * Middleware factory that enforces role-based access control.
 * Returns 401 if user is not authenticated, 403 if user lacks required role.
 */
export function requireRole(...roles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const role = req.user?.role;
    if (!role) return res.status(401).json({ message: "Unauthorized" });

    if (!roles.includes(role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
}
