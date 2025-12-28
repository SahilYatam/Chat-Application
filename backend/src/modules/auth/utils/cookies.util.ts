import { Response } from "express";

const ACCESS_TOKEN_MAX_AGE = 15 * 60 * 1000; 
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000; 

export const setCookies = (
    res: Response,
    accessToken: string,
    refreshToken: string
): void => {
    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "none",
        maxAge: ACCESS_TOKEN_MAX_AGE
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "none",
        maxAge: REFRESH_TOKEN_MAX_AGE
    });
}

export const clearCookies = (res: Response): void => {
    const isProduction = process.env.NODE_ENV === "production";

    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: isProduction,
        sameSite: "none",
    });

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: isProduction,
        sameSite: "none",
    });
}
