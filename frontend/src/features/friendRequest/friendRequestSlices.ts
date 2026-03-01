import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { friendRequestThunks } from "./friendRequestThunks";
import type {
    FriendRequest,
    FriendshipStatus,
    LoadingState,
} from "../../types";

type FriendRequestState = {
    requests: FriendRequest[];
    status: LoadingState;
    friendshipByUserId: Record<string, FriendshipStatus>;
    friendshipLoadingByUserId: Record<string, boolean>;
    error: string | null;
};

const initialState: FriendRequestState = {
    requests: [],
    status: "idle",
    friendshipByUserId: {},
    friendshipLoadingByUserId: {},
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

            // Send friend request
            .addCase(friendRequestThunks.sendFriendRequest.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(
                friendRequestThunks.sendFriendRequest.fulfilled,
                (state, action) => {
                    const userId = action.meta.arg;
                    state.friendshipByUserId[userId] = "pending_outgoing";
                },
            )
            .addCase(
                friendRequestThunks.sendFriendRequest.rejected,
                (state, action) => {
                    state.status = "failed";
                    state.error = action.payload as string;
                },
            )

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
                    const {friendId} = action.payload;

                    state.friendshipByUserId[friendId] = "friends"

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
            )

            // Get friendship status
            .addCase(
                friendRequestThunks.getFriendshipStatus.pending,
                (state, action) => {
                    const userId = action.meta.arg;
                    state.friendshipLoadingByUserId[userId] = true;
                    state.error = null;
                },
            )
            .addCase(
                friendRequestThunks.getFriendshipStatus.fulfilled,
                (state, action) => {
                    const userId = action.meta.arg;
                    state.friendshipLoadingByUserId[userId] = false;
                    state.friendshipByUserId[userId] = action.payload;
                },
            )
            .addCase(
                friendRequestThunks.getFriendshipStatus.rejected,
                (state, action) => {
                    const userId = action.meta.arg;
                    state.friendshipLoadingByUserId[userId] = false;
                    state.error = action.payload as string;
                },
            );
    },
});

export const { clearError } = friendRequestSlice.actions;
export default friendRequestSlice.reducer;
