import { prisma } from "./db/prisma";

/**
 * Checks if the application is ready to serve traffic.
 * Verifies database connectivity by executing a simple query.
 */
export async function checkReadiness() {
    await prisma.$queryRaw`SELECT 1`;
}
