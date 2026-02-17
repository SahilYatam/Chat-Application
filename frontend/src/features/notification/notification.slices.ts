import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Notifcation, LoadingState } from "../../types";
import { notificationThunks } from "./notification.thunks";

interface NotifcationState {
    items: Notifcation[];
    unreadCount: number;
    status: LoadingState;
    error: string | null;
}

const initialState: NotifcationState = {
    items: [],
    unreadCount: 0,
    status: "idle",
    error: null,
};

const notficationSlice = createSlice({
    name: "notification",
    initialState,

    reducers: {
        clearError: (state) => {
            state.error = null;
        },

        notificationReceived: (state, action: PayloadAction<Notifcation>) => {
            const exists = state.items.some((n) => n.id === action.payload.id);

            if(!exists){
                state.items.unshift(action.payload);
                state.unreadCount += 1
            }
        },  

        addNotification: (state, action) => {
            state.items.unshift(action.payload);
            state.unreadCount += 1;
        },

        markAsReadLocal: (state, action) => {
            const notifi = state.items.find((n) => n.id === action.payload);

            if (notifi && !notifi.isRead) {
                notifi.isRead = true;
                state.unreadCount -= 1;
            }
        },

        removeNotificationLocal: (state, action) => {
            state.items = state.items.filter((n) => n.id !== action.payload);
        },
    },

    extraReducers: (builder) => {
        builder
            // Fetch notifications
            .addCase(notificationThunks.fetchNotifications.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(
                notificationThunks.fetchNotifications.fulfilled,
                (state, action) => {
                    state.items = action.payload;
                    state.unreadCount = action.payload.filter((n) => !n.isRead).length;
                    state.status = "succeeded";
                    state.error = null;
                },
            )
            .addCase(
                notificationThunks.fetchNotifications.rejected,
                (state, action) => {
                    state.status = "failed";
                    state.error = action.payload ?? "Failed to fetch notifications";
                },
            );
    },
});

export const {
    clearError,
    notificationReceived,
    addNotification,
    markAsReadLocal,
    removeNotificationLocal,
} = notficationSlice.actions;

export default notficationSlice.reducer;
