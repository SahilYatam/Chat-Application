import { Request, Response, NextFunction } from "express";
import { logger, ApiError } from "../shared/index.js";

export const errorHandler = (
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    if(res.headersSent) return next(err);

    const error = err instanceof ApiError
        ? err
        : new ApiError(500, "Internal Server Error");

    logger.error(error.message, {stack: error.stack});

    res.status(error.statusCode).json({
        success: false,
        message: error.message
    });
};

export const notFoundHandler = (req: Request, res: Response): void => {
    res.status(404).json({
        success: false,
        message: `Router ${req.originalUrl} not found`,
        errors: [],
        data: null,
    });
};

