import { z } from "zod";
import { objectIdSchema } from "../../shared/index.js";
import { NotificationCursor } from "./notification.respository.js";
import { Types } from "mongoose";

const limitSchema = z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : 20))
    .refine((val) => Number.isInteger(val) && val > 0 && val <= 100, {
        message: "limit must be between 1 and 100",
    });

const notificationCursorSchema = z.object({
    createdAt: z.coerce.date(),
    id: objectIdSchema,
});

export type NotificationCursorDTO = z.infer<typeof notificationCursorSchema>;

export const mapCursorToDomain = (
    cursor?: NotificationCursorDTO
): NotificationCursor | undefined => {
    if (!cursor) return undefined;

    return {
        createdAt: cursor.createdAt,
        id: new Types.ObjectId(cursor.id),
    };
};

const notificationIdParamSchema = z.object({
    notificationId: objectIdSchema,
});

const receiverIdParamSchema = z.object({
    receiverId: objectIdSchema,
});

const cursorParamSchema = z.object({
    cursor: notificationCursorSchema.optional(),
});

const paginationQuerySchema = z.object({
    limit: limitSchema,
});

const getUserNotificationsSchema = z.object({
    params: receiverIdParamSchema,
    query: paginationQuerySchema.optional(),
    cursor: notificationCursorSchema.optional(),
});

const markNotificationAsReadSchema = z.object({
    params: notificationIdParamSchema.merge(receiverIdParamSchema),
});

const deleteNotificationSchema = z.object({
    params: notificationIdParamSchema.merge(receiverIdParamSchema),
});

export const notificationSchema = {
    notificationCursorSchema,
    cursorParamSchema,
    getUserNotificationsSchema,
    markNotificationAsReadSchema,
    deleteNotificationSchema,
};
