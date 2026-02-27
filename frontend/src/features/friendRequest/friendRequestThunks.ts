import axios from "axios";
import api from "../../api/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { FriendshipStatus } from "../../types";


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
            return res.data.data;
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
            return res.data.data;
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

const getFriendshipStatus = createAsyncThunk<
    FriendshipStatus,   
    string,             
    { rejectValue: string }
>(
    "friendRequest/status",
    async (userId, { rejectWithValue }) => {
        try {
            const res = await api.get(`/friendRequest/${userId}`);
            return res.data.data.status;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(
                    error.response?.data?.message ??
                    "failed to fetch friendship status. Please try again.",
                );
            }

            return rejectWithValue(
                "An unexpected error occurred while fetching friendship status",
            );
        }
    },
);



export const friendRequestThunks = {
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    getFriendRequests,
    getFriendshipStatus
};
