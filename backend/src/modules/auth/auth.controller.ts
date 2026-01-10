import { Request, Response } from "express";
import { authService } from "./auth.service.js";
import { authSchema } from "./auth.schema.js";
import { asyncHandler, ApiResponse } from "../../shared/index.js";
import { clearCookies, setCookies } from "./utils/cookies.util.js";
import { sessionService } from "./session.service.js";

const signup = asyncHandler(async (req: Request, res: Response) => {
    const input = authSchema.signupSchema.parse(req.body);
    const user = await authService.singup(input);

    const { accessToken, refreshToken } = await sessionService.createSession({
        userId: user.userId,
    });
    setCookies(res, accessToken, refreshToken);

    return res.status(201).json(new ApiResponse(201, user, "Signup Successful!"));
});

const login = asyncHandler(async (req: Request, res: Response) => {
    const input = authSchema.loginSchema.parse(req.body);
    const user = await authService.login(input);

    const { accessToken, refreshToken } = await sessionService.createSession({
        userId: user.userId,
    });
    setCookies(res, accessToken, refreshToken);

    return res.status(200).json(new ApiResponse(200, user, "Login Successful!"));
});

const logout = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = authSchema.refreshTokenValidationSchema.parse({
        refreshToken: req.cookies.refreshToken,
    });

    const { message } = await authService.logout(refreshToken);
    clearCookies(res);

    return res.status(200).json(new ApiResponse(200, {}, message));
});

const forgotUsername = asyncHandler(async (req: Request, res: Response) => {
    const { email } = authSchema.emailValidationSchema.parse(req.body);

    await authService.recoverUsername(email);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "If an account exists for this email, you will receive a message shortly"
            )
        );
});

const forgotPasswordRequest = asyncHandler(
    async (req: Request, res: Response) => {
        const { email } = authSchema.emailValidationSchema.parse(req.body);

        await authService.forgotPasswordRequest(email);

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    {},
                    "If an account exists for this email, you will receive a message shortly"
                )
            );
    }
);

const resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const { token } = authSchema.resetPasswordParamsSchema.parse(req.params);
    const { password } = authSchema.resetPasswordBodySchema.parse(req.body);

    await authService.resetPassword(token, password);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password reset successfull"));
});

const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken: oldRefreshToken } =
        authSchema.refreshTokenValidationSchema.parse({
            refreshToken: req.cookies.refreshToken,
        });

    const { accessToken, refreshToken: newRefreshToken } =
        await sessionService.refreshAccessToken(oldRefreshToken);

    setCookies(res, accessToken, newRefreshToken);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Access token refreshed"));
});

export const authController = {
    signup,
    login,
    logout,
    forgotUsername,
    forgotPasswordRequest,
    resetPassword,
    refreshAccessToken,
};
