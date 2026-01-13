import { PrismaClient } from "@prisma/client";

/**
 * Prisma Client instance for database operations.
 * Singleton pattern ensures single connection pool across the application.
 */
export const prisma = new PrismaClient();
