import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlices";
import userReducer from "../features/user/userSlices";
import friendRequestReducer from "../features/friendRequest/friendRequestSlices";
import friendshipReducer from "../features/friendship/friendship.slice";
import chatReducer from "../features/chat/chatSlices";
import notificationReducer from "../features/notification/notification.slices";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        friendRequest: friendRequestReducer,
        friendship: friendshipReducer,
        chat: chatReducer,
        notification: notificationReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
