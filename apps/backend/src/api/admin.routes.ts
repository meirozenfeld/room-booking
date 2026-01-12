import { Router } from "express";
import { authMiddleware } from "../infra/auth-middleware";
import { requireRole } from "../infra/role-guard";
import { prisma } from "../infra/db/prisma";

const router = Router();

// GET /api/admin/users
router.get("/users", authMiddleware, requireRole("ADMIN"), async (_req, res) => {
    const users = await prisma.user.findMany({
        select: { id: true, email: true, role: true, createdAt: true },
        orderBy: { createdAt: "desc" },
    });

    return res.json({ users });
});

export default router;
