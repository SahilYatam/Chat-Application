import { generateAccessAndRefreshToken } from "./utils/jwt.util.js";
import { hashToken } from "./utils/encryptToken.util.js";
import { CreateSessionInput, AuthTokens } from "./auth.types.js";
import { sessionRepo } from "./auth.repository.js";
import { ApiError, logger } from "../../shared/index.js";
import { Types } from "mongoose";

const createSession = async (
    data: CreateSessionInput
): Promise<AuthTokens> => {
    try {
        const userId = new Types.ObjectId(data.userId);

        const { accessToken, refreshToken: rawRefreshToken, refreshTokenExpiresAt } =
            generateAccessAndRefreshToken(userId.toString());

        const hashedToken = hashToken(rawRefreshToken);

        const session = await sessionRepo.createSession({
            userId,
            refreshToken: hashedToken,
            refreshTokenExpiresAt: new Date(refreshTokenExpiresAt),
            isActive: true,
            lastActivity: new Date(Date.now())
        });

        if (!session) {
            throw new ApiError(500, "Error while creating session!");
        }

        logger.info(
            `✅ Session created | user: ${userId} | sessionId: ${session._id}`
        );

        return { accessToken, refreshToken: rawRefreshToken };
    } catch (error) {
        logger.error(`❌ Failed creating session for user ${data.userId}`, { error });
        if (error instanceof Error) {
            throw error
        }
        throw new ApiError(500, "Failed to create session");
    }
};

const clearExipredSessions = async () => {
    try {
        const totalDeleted = await sessionRepo.deleteExpiredSessions();

        const msg = totalDeleted > 0
            ? `🧹 Cleaned ${totalDeleted} expired sessions`
            : "✅ No expired sessions";
        logger.info(msg)
    } catch (error) {
        logger.error("❌ Failed cleaning expired sessions", { message: error });

        if (error instanceof Error) {
            throw error
        }
        throw new ApiError(500, "Failed to delete expired sessions");
    }
};

const getSessionByRefreshToken = async (refreshToken: string) => {
    if (!refreshToken) {
        throw new ApiError(401, "Unauthorized");
    }

    const hashedToken = hashToken(refreshToken);
    const session = await sessionRepo.findSession(hashedToken)

    if (!session) {
        logger.warn("⚠️ Invalid refresh token (session not found)");
        throw new ApiError(401, "Unauthorized");
    }

    if (!session.refreshTokenExpiresAt || session.refreshTokenExpiresAt.getTime() < Date.now()) {
        logger.warn("⚠️ Refresh token expired", {
            userId: session.userId,
            expiresAt: session.refreshTokenExpiresAt,
        });
        throw new ApiError(401, "Unauthorized");
    }
    return session
}

const refreshAccessToken = async (refreshToken: string): Promise<AuthTokens> => {
    if (!refreshToken) {
        throw new ApiError(401, "Unauthorized");
    }

    const session = await getSessionByRefreshToken(refreshToken);

    const { accessToken, refreshToken: rawRefreshToken, refreshTokenExpiresAt } = generateAccessAndRefreshToken(session.userId.toString());

    const newRefreshToken = hashToken(rawRefreshToken);

    session.refreshToken = newRefreshToken;
    session.refreshTokenExpiresAt = refreshTokenExpiresAt;


    logger.info("✅ Access token refreshed", {
        userId: session.userId,
        sessionId: session._id,
    });

    return { accessToken, refreshToken: rawRefreshToken }
}

export const sessionService = {
    createSession,
    clearExipredSessions,
    refreshAccessToken,
};
