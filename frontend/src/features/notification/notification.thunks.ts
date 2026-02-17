import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../../api/axios";
import type { Notifcation } from "../../types";

const fetchNotifications = createAsyncThunk<
    Notifcation[],
    void,
    { rejectValue: string }
>("notification/fetch", async (_, { rejectWithValue }) => {
    try {
        const res = await api.get("/notification");
        return res.data.notifications;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return rejectWithValue(
                error.response?.data?.message ?? "Failed to fetch notification.",
            );
        }

        return rejectWithValue(
            "An unexpected error occurred while fetching notification",
        );
    }
});

const markNotificationAsRead = createAsyncThunk(
    "notfication/markAsRead",
    async (notificationId, { rejectWithValue }) => {
        try {
            const res = await api.patch(
                `/notification/mark-as-read/${notificationId}`,
            );
            return res.data.markAsRead;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(
                    error.response?.data?.message ??
                    "Failed to mark as read notification.",
                );
            }

            return rejectWithValue(
                "An unexpected error occurred while mark as read notification",
            );
        }
    },
);

const deleteNotification = createAsyncThunk(
    "notification/delete",
    async (notificationId, { rejectWithValue }) => {
        try {
            await api.delete(`/notification/delete/${notificationId}`);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(
                    error.response?.data?.message ?? "Failed to delete notification.",
                );
            }

            return rejectWithValue(
                "An unexpected error occurred while deleting notification",
            );
        }
    },
);

export const notificationThunks = {
    fetchNotifications,
    markNotificationAsRead,
    deleteNotification,
};
