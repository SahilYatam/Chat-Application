import axios from "axios";
import api from "../../api/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

const sendFriendRequest = createAsyncThunk(
    "friendRequets/send",
    async (receiverId: string, { rejectWithValue }) => {
        try {
            const res = await api.post(`/friendRequest/send/${receiverId}`);
            return res.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(
                    error.response?.data?.message ??
                    "Send friend request failed. Please try again.",
                );
            }

            return rejectWithValue(
                "An unexpected error occurred while sending friend request",
            );
        }
    },
);

const acceptFriendRequest = createAsyncThunk(
    "friendRequets/accept",
    async (requestId: string, { rejectWithValue }) => {
        try {
            const res = await api.post(`/friendRequest/accept/${requestId}`);
            return res.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(
                    error.response?.data?.message ??
                    "Accept friend request failed. Please try again.",
                );
            }

            return rejectWithValue(
                "An unexpected error occurred while accept friend request",
            );
        }
    },
);

const rejectFriendRequest = createAsyncThunk(
    "friendRequets/reject",
    async (requestId: string, { rejectWithValue }) => {
        try {
            const res = await api.post(`/friendRequest/reject/${requestId}`);
            return res.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(
                    error.response?.data?.message ??
                    "reject friend request failed. Please try again.",
                );
            }

            return rejectWithValue(
                "An unexpected error occurred while reject friend request",
            );
        }
    },
);

const getFriendRequests = createAsyncThunk(
    "friendRequest/get",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/friendRequest/");
            return res.data.data.requests;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(
                    error.response?.data?.message ??
                    "failed to fetch friend requests. Please try again.",
                );
            }

            return rejectWithValue(
                "An unexpected error occurred while fetching friend request",
            );
        }
    },
);

export const friendRequestThunks = {
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    getFriendRequests,
};
