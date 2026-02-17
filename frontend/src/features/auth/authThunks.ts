import axios from "axios";
import api from "../../api/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

import type {
    SignupCredentials,
    LoginCredentials,
    AuthResponse
} from "../../types/index";

const signupUser = createAsyncThunk<
    AuthResponse,
    SignupCredentials,
    { rejectValue: string }
>("auth/signupUser", async (credentials, { rejectWithValue }) => {
    try {
        const res = await api.post<{ data: AuthResponse }>("/auth/signup", credentials);

        return res.data.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return rejectWithValue(
                error.response?.data?.message ?? "Signup failed. Please try again.",
            );
        }

        return rejectWithValue("An unexpected error occurred while signup");
    }
});

const loginUser = createAsyncThunk<
    AuthResponse,
    LoginCredentials,
    { rejectValue: string }
>("auth/loginUser", async (credentials, { rejectWithValue }) => {
    try {
        const res = await api.post<{ data: AuthResponse }>("/auth/login", credentials);

        return res.data.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return rejectWithValue(
                error.response?.data?.message ?? "Login failed. Please try again.",
            );
        }

        return rejectWithValue("An unexpected error occurred while login");
    }
});

const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
    const res = await axios.post("/auth/logout");
    return res.data;
});

const recoverUsername = createAsyncThunk(
    "auth/recoverUsername",
    async (email, { rejectWithValue }) => {
        try {
            await api.post("/auth/recover-username", email);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(
                    error.response?.data?.message ?? "Recovery failed",
                );
            }

            return rejectWithValue("Unexpected error while recovering username");
        }
    },
);

export const authThunks = {
    signupUser,
    loginUser,
    logoutUser,
    recoverUsername
};
