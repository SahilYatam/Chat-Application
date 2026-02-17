import axios from "axios";
import api from "../../api/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

import type { User, UserProfile } from "../../types/index";

const getUserProfile = createAsyncThunk<
    UserProfile,
    void,
    { rejectValue: string }
>("user/userProfile", async (_, { rejectWithValue }) => {
    try {
        const res = await api.get<{ user: UserProfile }>("/user/my-profile");
        return res.data.user;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return rejectWithValue(
                error.response?.data?.message ??
                "Fetching user profile failed. Please try again.",
            );
        }

        return rejectWithValue(
            "An unexpected error occurred while getting user profile",
        );
    }
});

const searchUser = createAsyncThunk<User[], string, { rejectValue: string }>(
    "user/searchUser",
    async (username, { rejectWithValue }) => {
        try {
            const res = await api.get<{ users: User[] }>("/user/search-user", {
                params: { username },
            });

            return res.data.users;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(
                    error.response?.data?.message ??
                    "Search user failed. Please try again.",
                );
            }

            return rejectWithValue(
                "An unexpected error occurred while searching user",
            );
        }
    },
);

export const userThunks = {
    getUserProfile,
    searchUser,
};
