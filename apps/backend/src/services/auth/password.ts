import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

/**
 * Hashes a password using bcrypt with 10 salt rounds.
 * Recommended cost factor for production use.
 */
export async function hashPassword(password: string) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verifies a password against a bcrypt hash.
 * Uses constant-time comparison to prevent timing attacks.
 */
export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}
