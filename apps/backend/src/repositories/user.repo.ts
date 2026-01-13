import { prisma } from "../infra/db/prisma";
import { UserRole } from "@prisma/client";

/**
 * Repository for user data access operations.
 * All methods exclude sensitive fields like password from responses.
 */
export const UserRepo = {
  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  create(email: string, passwordHash: string, role: UserRole = UserRole.USER) {
    return prisma.user.create({
      data: { email, password: passwordHash, role },
      select: { id: true, email: true, role: true, createdAt: true },
    });
  },

  findPublicById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, role: true, createdAt: true },
    });
  },
};
