import jwt from "jsonwebtoken";
import { env } from "../../config/env";

export type JwtPayload = {
    userId: string;
    role: string;
};

/**
 * Signs a JWT access token with short expiration (default 15 minutes).
 * Used for API authentication.
 */
export function signAccessToken(payload: JwtPayload): string {
    return jwt.sign(payload, env.jwt.accessSecret, {
        expiresIn: env.jwt.accessExpiresIn as jwt.SignOptions["expiresIn"],
    });
}

/**
 * Signs a JWT refresh token with long expiration (default 7 days).
 * Used for obtaining new access tokens without re-authentication.
 */
export function signRefreshToken(payload: JwtPayload): string {
    return jwt.sign(payload, env.jwt.refreshSecret, {
        expiresIn: env.jwt.refreshExpiresIn as jwt.SignOptions["expiresIn"],
    });
}

/**
 * Verifies and decodes an access token.
 * Throws error if token is invalid, expired, or signed with wrong secret.
 */
export function verifyAccessToken(token: string): JwtPayload {
    return jwt.verify(token, env.jwt.accessSecret) as JwtPayload;
}

/**
 * Verifies and decodes a refresh token.
 * Throws error if token is invalid, expired, or signed with wrong secret.
 */
export function verifyRefreshToken(token: string): JwtPayload {
    return jwt.verify(token, env.jwt.refreshSecret) as JwtPayload;
}
