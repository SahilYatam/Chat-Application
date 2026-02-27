import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AppNotification, LoadingState, NotificationType } from "../../types";
import { notificationThunks } from "./notification.thunks";


interface ActiveEntity {
    type: NotificationType,
    entityId: string,
    senderUsername: string,
}

interface NotifcationState {
    items: AppNotification[];
    unreadCount: number;
    status: LoadingState;
    error: string | null;

    // UI intent state
    activeEntity: ActiveEntity | null
}

const initialState: NotifcationState = {
    items: [],
    unreadCount: 0,
    status: "idle",
    error: null,
    activeEntity: null
};

const notficationSlice = createSlice({
    name: "notification",
    initialState,

    reducers: {
        clearError: (state) => {
            state.error = null;
        },

        // Used by socket to push realtime notifications
        notificationReceived: (state, action: PayloadAction<AppNotification>) => {
            const exists = state.items.some((n) => n.id === action.payload.id);

            if(!exists){
                state.items.unshift(action.payload);
                state.unreadCount += 1
            }
        }, 

        // User clicks a notification
        notificationClicked: (
            state,
            action: PayloadAction<{type: NotificationType; entityId: string, senderUsername: string}>
        ) => {
            state.activeEntity = action.payload
        },

        // Clear active entity after accept or reject friend request
        clearActiveEntity: (state) => {
            state.activeEntity = null;
        },

        // Optimistic local only mark as read
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
            )

            // Mark as read
            .addCase(notificationThunks.markNotificationAsRead.fulfilled,(state, action) => {
                const notif = state.items.find((n) => n.id === action.payload);
                if(notif && !notif.isRead){
                    notif.isRead = true
                    state.unreadCount = Math.max(0, state.unreadCount - 1);
                }
            })

            // Delete notification
            .addCase(notificationThunks.deleteNotification.fulfilled, (state, action) => {
                const notif = state.items.find((n) => n.id === action.payload);

                if(notif && !notif.isRead){
                    state.unreadCount = Math.max(0, state.unreadCount - 1);
                }
                state.items = state.items.filter((n) => n.id !== action.payload);
            })
    },
});

export const {
    clearError,
    notificationReceived,
    notificationClicked,
    clearActiveEntity,
    markAsReadLocal,
    removeNotificationLocal,
} = notficationSlice.actions;

export default notficationSlice.reducer;
