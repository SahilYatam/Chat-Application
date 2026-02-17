import { createSlice } from "@reduxjs/toolkit";
import type { Friend, LoadingState } from "../../types";
import { getFriendList } from "./friendship.thunks";

interface FriendshipState {
    friends: Friend[];
    status: LoadingState;
    error: string | null;
}

const initialState: FriendshipState = {
    friends: [],
    status: "idle",
    error: null,
};

const friendshipSlice = createSlice({
    name: "friendship",
    initialState,

    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(getFriendList.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(getFriendList.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.friends = action.payload;
            })
            .addCase(getFriendList.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || "Something went wrong";
            });
    },
});

export const { clearError } = friendshipSlice.actions;
export default friendshipSlice.reducer;
