import { prisma } from "../../infra/db/prisma";

type BlockInput = {
    roomId: string;
    startDate: Date;
    endDate: Date;
};

function normalizeDate(d: Date) {
    const date = new Date(d);
    date.setHours(0, 0, 0, 0);
    return date;
}

export async function blockRoomService(input: BlockInput) {
    const { roomId, startDate, endDate } = input;

    const blocks = [];
    let current = normalizeDate(startDate);
    const end = normalizeDate(endDate);

    while (current <= end) {
        blocks.push({
            roomId,
            date: current,
            isBlocked: true,
        });
        current = new Date(current.getTime() + 24 * 60 * 60 * 1000);
    }

    await prisma.roomAvailability.createMany({
        data: blocks,
        skipDuplicates: true,
    });

    return { blockedDates: blocks.length };
}

export async function unblockRoomService(input: BlockInput) {
    const { roomId, startDate, endDate } = input;

    return prisma.roomAvailability.deleteMany({
        where: {
            roomId,
            date: {
                gte: normalizeDate(startDate),
                lte: normalizeDate(endDate),
            },
        },
    });
}

export async function listRoomBlocksService(roomId: string) {
    return prisma.roomAvailability.findMany({
        where: {
            roomId,
            isBlocked: true,
        },
        orderBy: { date: "asc" },
    });
}
