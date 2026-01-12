import { Router } from "express";
import { authMiddleware } from "../infra/auth-middleware";
import { prisma } from "../infra/db/prisma";

const router = Router();

// GET /api/users/me
router.get("/me", authMiddleware, async (req: any, res) => {
    const userId = req.user.userId;

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, role: true, createdAt: true },
    });

    return res.json({ user });
});

export default router;
