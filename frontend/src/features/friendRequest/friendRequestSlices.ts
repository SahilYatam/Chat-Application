import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { friendRequestThunks } from "./friendRequestThunks";
import type { FriendRequest, LoadingState } from "../../types";

type FriendRequestState = {
    requests: FriendRequest[];
    status: LoadingState;
    error: string | null;
};

const initialState: FriendRequestState = {
    requests: [],
    status: "idle",
    error: null,
};

const friendRequestSlice = createSlice({
    name: "friendRequests",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder

            // Get friend request
            .addCase(friendRequestThunks.getFriendRequests.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(
                friendRequestThunks.getFriendRequests.fulfilled,
                (state, action: PayloadAction<FriendRequest[]>) => {
                    state.status = "succeeded";
                    state.requests = action.payload;
                },
            )
            .addCase(
                friendRequestThunks.getFriendRequests.rejected,
                (state, action) => {
                    state.status = "failed";
                    state.error = action.payload as string;
                },
            )

            // Accept request
            .addCase(
                friendRequestThunks.acceptFriendRequest.fulfilled,
                (state, action) => {
                    const requestId = action.meta.arg;
                    state.requests = state.requests.filter((req) => req.id !== requestId);
                },
            )

            // Reject request
            .addCase(
                friendRequestThunks.rejectFriendRequest.fulfilled,
                (state, action) => {
                    const requestId = action.meta.arg;
                    state.requests = state.requests.filter((req) => req.id !== requestId);
                },
            );
    },
});

export const { clearError } = friendRequestSlice.actions;
export default friendRequestSlice.reducer;
