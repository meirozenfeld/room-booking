import { Response } from "express";
import { AuthenticatedRequest } from "../infra/auth-middleware";
import { getUserById } from "../services/users.service";

/**
 * Returns the current authenticated user's profile.
 */
export async function getMeHandler(
    req: AuthenticatedRequest,
    res: Response
) {
    const userId = req.user!.userId;
    const user = await getUserById(userId);

    res.json({ user });
}
