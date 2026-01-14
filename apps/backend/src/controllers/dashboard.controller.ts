import { Response } from "express";
import { prisma } from "../infra/db/prisma";
import { AuthenticatedRequest } from "../infra/auth-middleware";

export async function getDashboardHandler(
    req: AuthenticatedRequest,
    res: Response
) {
    const userId = req.user?.userId;
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const now = new Date();

    const [totalBookings, upcomingBookings, upcomingPreview] =
        await Promise.all([
            prisma.booking.count({
                where: { userId },
            }),
            prisma.booking.count({
                where: {
                    userId,
                    startDate: { gt: now },
                    status: "CONFIRMED",
                },
            }),
            prisma.booking.findMany({
                where: {
                    userId,
                    startDate: { gt: now },
                    status: "CONFIRMED",
                },
                orderBy: { startDate: "asc" },
                take: 3,
                select: {
                    id: true,
                    startDate: true,
                    endDate: true,
                    room: {
                        select: {
                            name: true,
                        },
                    },
                },
            }),
        ]);

    return res.json({
        stats: {
            totalBookings,
            upcomingBookings,
        },
        upcomingPreview,
    });
}

