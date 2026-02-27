import { authRepo, sessionRepo } from "./auth.repository.js";
import { userRepo } from "../user/user.repository.js";
import { LoginInput, SignupInput, UserPublicData } from "./auth.types.js";
import { ApiError } from "../../shared/index.js";
import { comparePassword, hashPassword } from "./utils/password.util.js";
import { Gender } from "../user/user.model.js";
import { generateToken, hashToken } from "./utils/encryptToken.util.js";
import { logger } from "../../shared/index.js";
import {
    sendPasswordResetEmail,
    sendUsernameRecoveryEmail,
} from "../../shared/email/email.service.js";

const singup = async (data: SignupInput): Promise<UserPublicData> => {
    const existingUser = await userRepo.findUserByUsername(data.username);
    console.log("existingUser =>", existingUser);
    if (existingUser) {
        throw new ApiError(403, "Username already taken");
    }

    const hashedPassword = await hashPassword(data.password);

    const avatar =
        data.gender === Gender.MALE
            ? `https://avatar.iran.liara.run/public/boy?username=${encodeURIComponent(data.name)}`
            : `https://avatar.iran.liara.run/public/girl?username=${encodeURIComponent(data.name)}`;

    const user = await userRepo.createUser({
        username: data.username,
        name: data.name,
        gender: data.gender,
        avatar,
    });

    await authRepo.createAuth({
        userId: user._id,
        password: hashedPassword,
        email: data.email,
    });

    return {
        userId: user._id.toString(),
        username: user.username,
        name: user.name,
        avatar: user.avatar
    };
};

const login = async (data: LoginInput): Promise<UserPublicData> => {
    const user = await userRepo.findUserByUsername(data.username);
    
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const authUser = await authRepo.findByUserId(user._id);
    console.log("auth userId:", authUser)
    if (!authUser) {
        throw new ApiError(404, "Auth record not found for user");
    }

    const isCorrect = await comparePassword(data.password, authUser.password);
    if (!isCorrect) {
        throw new ApiError(401, "Invalid password");
    }

    return {
        userId: user._id.toString(),
        username: user.username,
        name: user.name,
        avatar: user.avatar,
    };
};

const logout = async (refreshToken: string) => {
    const token = hashToken(refreshToken);
    const session = await sessionRepo.deleteSessionByHashedToken(token);

    if (!session) throw new ApiError(403, "Unauthorized request");

    return { message: "Logout Sccuessfull" };
};

const recoverUsername = async (email: string): Promise<void> => {
    const authUser = await authRepo.findUserByEmail(email);
    if (!authUser) return;

    const username = await userRepo.findUsernameById(authUser.userId);

    if (!username) {
        logger.error(`Username not found for userId=${authUser.userId.toString()}`);
        return;
    }

    await sendUsernameRecoveryEmail(email, username);
};

const forgotPasswordRequest = async (email: string): Promise<void> => {
    const authUser = await authRepo.findUserByEmail(email);
    if (!authUser) return;

    const rawToken = generateToken();
    const resetPasswordTokenExipresAt = new Date(Date.now() + 10 * 60 * 1000);

    const hashedToken = hashToken(rawToken);

    authUser.resetPasswordToken = hashedToken;
    authUser.resetPasswordTokenExpiresAt = resetPasswordTokenExipresAt;

    const resetLink = `${process.env.CLIENT_URL}/forget-password/${rawToken}`;

    await sendPasswordResetEmail(email, resetLink);
};

const resetPassword = async (
    token: string,
    password: string,
): Promise<void> => {
    const hashedToken = hashToken(token);

    const user = await authRepo.findHashedResetPasswordToken(hashedToken);
    if (
        !user ||
        !user.resetPasswordTokenExpiresAt ||
        user.resetPasswordTokenExpiresAt < new Date()
    ) {
        throw new ApiError(403, "Invalid or expired reset token");
    }

    const newHashedPassword = await hashPassword(password);
    await authRepo.updateAuthById({
        id: user._id,
        updates: {
            password: newHashedPassword,
            resetPasswordToken: null,
            resetPasswordTokenExpiresAt: null,
        },
    });
};

export const authService = {
    singup,
    login,
    logout,
    recoverUsername,
    forgotPasswordRequest,
    resetPassword,
};
