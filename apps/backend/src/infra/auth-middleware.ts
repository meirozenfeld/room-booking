import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../services/auth/jwt";

export interface AuthenticatedRequest extends Request {
    user?: {
        userId: string;
        role: string;
    };
}

export function authMiddleware(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Missing token" });
    }

    const token = header.split(" ")[1];

    try {
        const payload = verifyAccessToken(token);
        req.user = payload;
        next();
    } catch {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}
