import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";
import type { Friend } from "../../types";

export const getFriendList = createAsyncThunk<
    Friend[],
    void,
    { rejectValue: string }
>("friendship/getFriendList", async (_, { rejectWithValue }) => {
    try {
        const res = await api.get("/friendship");
        return res.data.friendList;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return rejectWithValue(
            error.response?.data?.message || "Failed to fetch messages",
        );
    }
});
