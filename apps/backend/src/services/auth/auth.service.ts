import { UserRepo } from "../../repositories/user.repo";
import { RefreshTokenRepo } from "../../repositories/refresh-token.repo";
import { hashPassword, verifyPassword } from "./password";
import {
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken,
    type JwtPayload,
} from "./jwt";
import { env } from "../../config/env";

/**
 * Parses refresh token expiry string to Date object.
 * Supports numeric seconds or time unit suffixes (s/m/h/d).
 * Falls back to 7 days if format is invalid.
 */
function parseRefreshExpiryToDate() {
    const v = env.jwt.refreshExpiresIn;

    const now = Date.now();
    const asNumber = Number(v);
    if (!Number.isNaN(asNumber)) return new Date(now + asNumber * 1000);

    const m = /^(\d+)([smhd])$/.exec(v);
    if (!m) {
        return new Date(now + 7 * 24 * 60 * 60 * 1000);
    }

    const n = Number(m[1]);
    const unit = m[2];
    const mult =
        unit === "s"
            ? 1000
            : unit === "m"
                ? 60 * 1000
                : unit === "h"
                    ? 60 * 60 * 1000
                    : 24 * 60 * 60 * 1000;

    return new Date(now + n * mult);
}

export class AuthService {
    /**
     * Registers a new user and returns access/refresh token pair.
     * Implements single active refresh token per user strategy for simple revocation.
     */
    static async register(email: string, password: string) {
        const existing = await UserRepo.findByEmail(email);
        if (existing) {
            return {
                message: "Email already in use",
            };
        }

        const passwordHash = await hashPassword(password);
        const user = await UserRepo.create(email, passwordHash);

        const payload: JwtPayload = { userId: user.id, role: user.role };
        const accessToken = signAccessToken(payload);
        const refreshToken = signRefreshToken(payload);

        // Single active refresh token per user (simple revocation strategy)
        await RefreshTokenRepo.deleteAllForUser(user.id);
        await RefreshTokenRepo.create(user.id, refreshToken, parseRefreshExpiryToDate());

        return {
            user,
            accessToken,
            refreshToken,
        };
    }

    static async login(email: string, password: string) {
        const userRow = await UserRepo.findByEmail(email);
        if (!userRow) {
            return { message: "Invalid credentials" };
        }

        const ok = await verifyPassword(password, userRow.password);
        if (!ok) {
            return { message: "Invalid credentials" };
        }

        const user = await UserRepo.findPublicById(userRow.id);
        if (!user) return { message: "Invalid credentials" };

        const payload: JwtPayload = { userId: user.id, role: user.role };
        const accessToken = signAccessToken(payload);
        const refreshToken = signRefreshToken(payload);

        await RefreshTokenRepo.deleteAllForUser(user.id);
        await RefreshTokenRepo.create(user.id, refreshToken, parseRefreshExpiryToDate());

        return {
            user,
            accessToken,
            refreshToken,
        };
    }

    /**
     * Refreshes access token using refresh token.
     * Implements token rotation: old refresh token is revoked and new pair is issued.
     * Verifies token exists in DB to enable server-side revocation.
     */
    static async refresh(refreshToken: string) {
        // Verify JWT signature and expiry
        let payload: JwtPayload;
        try {
            payload = verifyRefreshToken(refreshToken);
        } catch {
            return { message: "Invalid refresh token" };
        }

        // Verify token exists in DB (enables server-side revocation)
        const row = await RefreshTokenRepo.find(refreshToken);
        if (!row) return { message: "Invalid refresh token" };
        if (row.expiresAt.getTime() < Date.now()) {
            await RefreshTokenRepo.delete(refreshToken).catch(() => { });
            return { message: "Refresh token expired" };
        }

        // Token rotation: delete old token and issue new pair
        await RefreshTokenRepo.delete(refreshToken).catch(() => { });
        const newAccessToken = signAccessToken({ userId: payload.userId, role: payload.role });
        const newRefreshToken = signRefreshToken({ userId: payload.userId, role: payload.role });

        await RefreshTokenRepo.create(payload.userId, newRefreshToken, parseRefreshExpiryToDate());

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        };
    }

    /**
     * Revokes refresh token on logout.
     * Idempotent operation - safe to call multiple times.
     */
    static async logout(refreshToken: string) {
        await RefreshTokenRepo.delete(refreshToken).catch(() => { });
    }
}
