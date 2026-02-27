import { logger } from "./shared/index.js";
import { connectDB } from "./config/db.js";
import mongoose from "mongoose";
import {server} from "./socket/socket.js"
import "./workers/notification.worker.js"
let httpServer = server;

let isShuttingDown = false;

const PORT = Number(process.env.PORT) || 8000;
const SHUTDOWN_TIMEOUT = 10000;

const startServer = async (): Promise<void> => {
    try {
        await connectDB();

        httpServer.listen(PORT, () => {
            logger.info(`🚀 Server running on PORT: ${PORT}`);
        })
    } catch (error: unknown) {
        if (error instanceof Error) {
            logger.error(`Failed to start server: ${error.message}`, {
                stack: error.stack,
            });
        } else {
            logger.error("Failed to start server with unknown error");
        }

        process.exit(1);
    }

    process.on("uncaughtException", (error: Error) => {
        handleFatalError("uncaughtException", error);
    });

    process.on("unhandledRejection", (reason: unknown) => {
        const error = reason instanceof Error ? reason : new Error(String(reason));

        handleFatalError("unhandledRejection", error);
    });

    process.once("SIGINT", () => gracefulShutdown("SIGINT"));
    process.once("SIGTERM", () => gracefulShutdown("SIGTERM"));
};

const handleFatalError = async (type: string, error: Error): Promise<void> => {
    if (isShuttingDown) return;

    logger.error(`🚨 ${type.toUpperCase()} Error: ${error.message}`, {
        stack: error.stack,
    });

    await gracefulShutdown(type);
};

const gracefulShutdown = async (signal: string): Promise<void> => {
    if (isShuttingDown) {
        logger.info("Shutdown already in progress, ignoring signal");
        return;
    }

    isShuttingDown = true;
    logger.info(`🛑 Shutting down (${signal})...`);

    const shutdownTimer = setTimeout(() => {
        logger.error("Force shutdown after timeout");
        process.exit(1);
    }, SHUTDOWN_TIMEOUT);

    try {
        if(httpServer){
            await new Promise<void>((resolve) =>
                httpServer!.close(() => resolve())
            );
            logger.info("🛑 HTTP server closed");
        }
        
        if(mongoose.connection.readyState === mongoose.ConnectionStates.connected){
            await mongoose.disconnect();
            logger.info("🔌 MongoDB connection closed");
        }

        clearTimeout(shutdownTimer);
        logger.info("✅ Shutdown complete");
        process.exit(0);
    } catch (error: unknown) {
        clearTimeout(shutdownTimer);

        if (error instanceof Error) {
            logger.error(`Error during shutdown: ${error.message}`, {
                stack: error.stack,
            });
        } else {
            logger.error("Unknown error during shutdown");
        }

        process.exit(1);
    }

};
startServer();