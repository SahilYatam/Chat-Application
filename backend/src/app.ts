import dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") {
    dotenv.config();
}
import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import {
    errorHandler,
    notFoundHandler,
} from "./middlewares/globalErrorHandler.js";

// ======== Import Routes ========
import authRouter from "./modules/auth/auth.routes.js";
import userRouter from "./modules/user/user.routes.js";
import chatRouter from "./modules/chat/chat.routes.js";
import friendRequestRouter from "./modules/friendRequest/friendRequest.routes.js";
import friendshipRouter from "./modules/friendship/friendship.routes.js";
import notificationRouter from "./modules/notification/notification.routes.js";

export const app = express();

app.use(helmet());
// app.use(cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
// }));
app.use(cors());
app.use(morgan("dev"));
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader("Cache-Control", "no-store");
    next();
});

app.get("/health", (req: Request, res: Response) => {
    return res.status(200).json({ status: "OK" });
});

function limiter(windowMs: number, max: number) {
    return rateLimit({
        windowMs,
        max,
        message: "Too many requests, please try again later.",
        standardHeaders: true,
        legacyHeaders: false,
    });
}

const globalRateLimiting = limiter(15 * 60 * 1000, 1000); // 15 minutes, 1000 requests
app.use(globalRateLimiting);

// ============== ROUTES ==============
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/friendRequest", friendRequestRouter);
app.use("/api/v1/friendship", friendshipRouter);
app.use("/api/v1/notification", notificationRouter);

app.use(notFoundHandler);
app.use(errorHandler);
