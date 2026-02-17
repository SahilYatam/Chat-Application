import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";
import type { Message } from "../../types/index";

export const getMessages = createAsyncThunk<
    {conversationId: string; messages: Message[]},
    string,
    {rejectValue: string}
>(
    "chat/getMessages",
    async(conversationId, {rejectWithValue}) => {
        try {
            const res = await api.get(`/chat/${conversationId}`);
            return {conversationId, messages: res.data.messages}
        } catch {
            return rejectWithValue("Failed to fetch messages");
        }
    }
)
