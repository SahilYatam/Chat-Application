import crypto from "crypto";

/**
 * generating a cryptographically secure random refresh token, store the plain token in an HTTP-only cookie, store only its hash in the database, and compare hashes during refresh to prevent token leakage attacks.
 */

const REFRESH_TOKEN_BYTES = 32;
const REFRESH_TOKEN_EXPIRY_DAYS = 7;

export const generateToken = (): string => {
    return crypto.randomBytes(REFRESH_TOKEN_BYTES).toString("hex");
}

export const hashToken = (rawToken: string): string => {
    return crypto
        .createHash("sha256")
        .update(rawToken)
        .digest("hex");
}

export const tokenExpiresAt = (): Date => {
    return new Date(
        Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000
    );
}
