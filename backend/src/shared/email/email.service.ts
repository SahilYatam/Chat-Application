import {
    PASSWORD_RESET_REQUEST_TEMPLATE,
    PASSWORD_RESET_SUCCESS_TEMPLATE,
    USERNAME_RECOVERY_TEMPLATE
} from "./email.templates.js";
import { transporter } from "../../config/email.config.js";
import logger from "../monitoring/logger.js";
import { ApiError } from "../responses/ApiError.js";


type TemplateVariables = Record<string, string>;

const injectTemplateVariables = (
    template: string,
    variables: TemplateVariables
) => {
    let result = template;

    for (const [key, value] of Object.entries(variables)) {
        result = result.replace(new RegExp(`{{${key}}}`, "g"), value);
    }
    return result;
};

export const sendUsernameRecoveryEmail = async (
    email: string,
    username: string,
) => {
    try {
        const html = injectTemplateVariables(USERNAME_RECOVERY_TEMPLATE, {
            username,
            support_email: "support@chat.com",
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER!,
            to: email,
            subject: "Recover Username",
            html,
        });
    } catch (err) {
        const error = err as Error;

        logger.error("Error while sending recover username email", {
            message: error.message,
            stack: error.stack,
        });

        throw new ApiError(500, "Error while sending recover username email");
    }
}

export const sendPasswordResetEmail = async (
    email: string,
    resetLink: string
): Promise<void> => {
    try {
        const html = injectTemplateVariables(PASSWORD_RESET_REQUEST_TEMPLATE, {
            reset_link: resetLink,
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER!,
            to: email,
            subject: "Reset Your Password",
            html,
        });
    } catch (err) {
        const error = err as Error;

        logger.error("Error while sending password reset email", {
            message: error.message,
            stack: error.stack,
            email,
        });

        throw new ApiError(500, "Error while sending password reset email");
    }
};

export const sendPasswordResetSuccessEmail = async (
    email: string
): Promise<void> => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER!,
            to: email,
            subject: "Your Password Was Successfully Changed",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
        });
    } catch (err) {
        const error = err as Error;

        logger.error("Error while sending password reset success email", {
            message: error.message,
            stack: error.stack,
            email,
        });

        throw new ApiError(500, "Error while sending password reset success email");
    }
};
