import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { LoadingState, UserProfile } from "../../types";
import { userThunks } from "./userThunks";

interface UserState {
    users: UserProfile[];
    status: LoadingState;
    error: string | null;
}

const initialState: UserState = {
    users: [],
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
            // Get all users profile
            .addCase(userThunks.getAllUserForSidePanel.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(userThunks.getAllUserForSidePanel.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.users = action.payload;
            })
            .addCase(userThunks.getAllUserForSidePanel.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload ?? "Failed to fetch all users profile";
            })

            // Search users
            .addCase(userThunks.searchUser.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(
                userThunks.searchUser.fulfilled,
                (state, action: PayloadAction<UserProfile[]>) => {
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
