import { prisma } from "../../infra/db/prisma";

export async function getAdminDashboardService() {
    const now = new Date();

    const [totalBookings, upcomingBookings, upcomingPreview] =
        await prisma.$transaction([
            // 1. Total bookings (all users)
            prisma.booking.count(),

            // 2. Upcoming bookings (all users)
            prisma.booking.count({
                where: {
                    startDate: { gt: now },
                    status: "CONFIRMED",
                },
            }),

            // 3. Next 3 upcoming bookings (all users)
            prisma.booking.findMany({
                where: {
                    startDate: { gt: now },
                    status: "CONFIRMED",
                },
                orderBy: { startDate: "asc" },
                take: 3,
                select: {
                    id: true,
                    startDate: true,
                    endDate: true,
                    user: {
                        select: {
                            id: true,
                            email: true,
                        },
                    },
                    room: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            }),
        ]);

    return {
        stats: {
            totalBookings,
            upcomingBookings,
        },
        upcomingPreview,
    };
}
