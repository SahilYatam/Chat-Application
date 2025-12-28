import mongoose from "mongoose";
import { logger } from "../shared/index.js";

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 5000;

export const connectDB = async (): Promise<void> => {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
        throw new Error("MONGODB_URI is not defined");
    }

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            const conn = await mongoose.connect(mongoUri);

            logger.info(`🔌 MongoDB connected to ${conn.connection.host}`);
            return;
        } catch (error: unknown) {
            if (error instanceof Error) {
                logger.error(`MongoDB connection attempt ${attempt} failed`, {
                    message: error.message,
                    stack: error.stack,
                    attempt,
                    maxRetries: MAX_RETRIES,
                });
            } else {
                logger.error(
                    `MongoDB connection attempt ${attempt} failed with unknown error`,
                    {
                        attempt,
                        maxRetries: MAX_RETRIES,
                    }
                );
            }

            if (attempt === MAX_RETRIES) {
                logger.error("❌ All MongoDB connection attempts failed. Exiting...");

                if (error instanceof Error) {
                    throw error;
                }

                throw new Error("MongoDB connection failed with non-Error rejection");
            }

            logger.info(
                `🔁 Retrying MongoDB connection in ${RETRY_DELAY_MS}ms (${attempt}/${MAX_RETRIES})`
            );

            await sleep(RETRY_DELAY_MS);
        }
    }
};

const sleep = (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};
