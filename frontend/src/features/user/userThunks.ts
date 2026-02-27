import axios from "axios";
import api from "../../api/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

import type { UserProfile } from "../../types/index";

const getAllUserForSidePanel = createAsyncThunk<
    UserProfile[],
    void,
    { rejectValue: string }
>("user/allUsers", async (_, { rejectWithValue }) => {
    try {
        const res = await api.get<{ data: UserProfile[] }>("/user");
        console.log("all users: ", res.data)
        return res.data.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return rejectWithValue(
                error.response?.data?.message ??
                "Fetching all users profile failed. Please try again.",
            );
        }

        return rejectWithValue(
            "An unexpected error occurred while getting all users profile",
        );
    }
});

const getUserProfile = createAsyncThunk<
    UserProfile,
    void,
    { rejectValue: string }
>("user/userProfile", async (_, { rejectWithValue }) => {
    try {
        const res = await api.get("/user/my-profile");

        return res.data.data;
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

const searchUser = createAsyncThunk<
    UserProfile[],
    string,
    { rejectValue: string }
>("user/searchUser", async (username, { rejectWithValue }) => {
    try {
        const res = await api.get<{ users: UserProfile[] }>("/user/search-user", {
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

        return rejectWithValue("An unexpected error occurred while searching user");
    }
});

export const userThunks = {
    getAllUserForSidePanel,
    getUserProfile,
    searchUser,
};
