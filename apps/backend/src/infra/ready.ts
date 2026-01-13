import { prisma } from "./db/prisma";

export async function checkReadiness() {
    await prisma.$queryRaw`SELECT 1`;
}
