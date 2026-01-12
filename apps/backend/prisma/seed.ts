import "dotenv/config";
import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
    const passwordHash = await bcrypt.hash("password123", 10);

    const admin = await prisma.user.upsert({
        where: { email: "admin@example.com" },
        update: {},
        create: {
            email: "admin@example.com",
            password: passwordHash,
            role: UserRole.ADMIN,
        },
    });

    const user = await prisma.user.upsert({
        where: { email: "user@example.com" },
        update: {},
        create: {
            email: "user@example.com",
            password: passwordHash,
            role: UserRole.USER,
        },
    });

    const roomA = await prisma.room.create({
        data: {
            name: "Conference Room A",
            capacity: 10,
        },
    });

    const roomB = await prisma.room.create({
        data: {
            name: "Meeting Room B",
            capacity: 4,
        },
    });

    console.log("Seeded:", { admin: admin.email, user: user.email, roomA, roomB });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
