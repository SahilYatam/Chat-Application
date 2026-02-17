import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { LoadingState, User, UserProfile } from "../../types";
import { userThunks } from "./userThunks";

interface UserState {
    users: User[];
    user: UserProfile | null;
    status: LoadingState;
    error: string | null;
}

const initialState: UserState = {
    users: [],
    user: null,
    status: "idle",
    error: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,

    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder
            // Get user profile
            .addCase(userThunks.getUserProfile.pending, (state) => {
                state.status = "pending";
                state.error = null;
            })
            .addCase(userThunks.getUserProfile.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.user = action.payload;
                state.error = null;
            })
            .addCase(userThunks.getUserProfile.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload ?? "Failed to fetch user profile";
            })

            // Search users
            .addCase(userThunks.searchUser.pending, (state) => {
                state.status = "pending";
                state.error = null;
            })
            .addCase(
                userThunks.searchUser.fulfilled,
                (state, action: PayloadAction<User[]>) => {
                    state.status = "succeeded";
                    state.users = action.payload;
                },
            )
            .addCase(userThunks.searchUser.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload ?? "User search failed";
            });
    },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;
