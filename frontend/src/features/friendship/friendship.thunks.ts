import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";
import type { Friend } from "../../types";

const getFriendList = createAsyncThunk<
    Friend[],
    void,
    { rejectValue: string }
>("friendship/getFriendList", async (_, { rejectWithValue }) => {
    try {
        const res = await api.get("/friendship");
        console.log("FriendList: ", res.data.data)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return res.data.data.map((friend: any) => ({
            id: friend.id,
            username: friend.username,
            avatar: friend.avatar
        }));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return rejectWithValue(
            error.response?.data?.message || "Failed to fetch messages",
        );
    }
});

export const friendshipThunk = {
    getFriendList
}