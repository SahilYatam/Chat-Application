import nodemailer from "nodemailer";

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    throw new Error("EMAIL_USER or EMAIL_PASSWORD is not defined");
}

export const transporter = nodemailer.createTransport({
    service: "gmail",
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});