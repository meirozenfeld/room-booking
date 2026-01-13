import { prisma } from "../infra/db/prisma";

/**
 * Repository for refresh token operations.
 * Enables server-side token revocation and management.
 */
export const RefreshTokenRepo = {
    create(userId: string, token: string, expiresAt: Date) {
        return prisma.refreshToken.create({
            data: { userId, token, expiresAt },
        });
    },

    find(token: string) {
        return prisma.refreshToken.findUnique({ where: { token } });
    },

    delete(token: string) {
        return prisma.refreshToken.delete({ where: { token } });
    },

    deleteAllForUser(userId: string) {
        return prisma.refreshToken.deleteMany({ where: { userId } });
    },
};
