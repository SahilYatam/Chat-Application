import { Request, Response } from "express";
import {
    asyncHandler,
    ApiResponse,
    normalizeObjectId,
} from "../../shared/index.js";
import { notificationService } from "./notification.service.js";
import {
    notificationSchema,
    mapCursorToDomain,
} from "./notification.schema.js";

const getUserNotifications = asyncHandler(
    async (req: Request, res: Response) => {
        const parsed = notificationSchema.getUserNotificationsSchema.parse({
            params: req.params,
            query: req.query,
        });

        const receiverId = parsed.params.receiverId;
        const limit = parsed.query?.limit;
        const cursor = parsed.cursor;

        const normalizedReceiverId = normalizeObjectId(receiverId);

        const domainCursor = mapCursorToDomain(cursor);

        const notifications = await notificationService.getUserNotifications(
            normalizedReceiverId,
            limit,
            domainCursor,
        );

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    notifications,
                    "Notifications fetched successfully",
                ),
            );
    },
);

const notificationMarkAsRead = asyncHandler(
    async (req: Request, res: Response) => {
        const parsed = notificationSchema.markNotificationAsReadSchema.parse({
            params: req.params,
        });

        const { notificationId, receiverId } = parsed.params;

        const notifId = normalizeObjectId(notificationId);
        const userId = normalizeObjectId(receiverId);

        const markAsRead = await notificationService.notificationMarkAsRead({
            notificationId: notifId,
            receiverId: userId,
        });

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    markAsRead,
                    "Notifcations marked as read successfull",
                ),
            );
    },
);

const deleteNotification = asyncHandler(async (req: Request, res: Response) => {
    const parsed = notificationSchema.markNotificationAsReadSchema.parse({
        params: req.params,
    });

    const { notificationId, receiverId } = parsed.params;

    const notifId = normalizeObjectId(notificationId);
    const userId = normalizeObjectId(receiverId);

    await notificationService.deleteNotification(notifId, userId);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Notifcations deleted successfully"));
});

export const notificationController = {
    getUserNotifications,
    notificationMarkAsRead,
    deleteNotification,
};
