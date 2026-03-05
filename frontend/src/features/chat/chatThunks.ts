import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";
import type { Message, Conversation } from "../../types/index";

export const sendMessageThunk = createAsyncThunk<
    Message,
    { receiverId: string; message: string },
    { rejectValue: string }
>("chat/sendMessage", async (data, { rejectWithValue }) => {
    try {
        const res = await api.post("/chat/send-message", data);
        console.log("Send Message data:", res.data.data);
        return res.data.data;
    } catch {
        return rejectWithValue("Failed to send message");
    }
});

export const getResolveConversation = createAsyncThunk<
    Conversation,
    string,
    { rejectValue: string }
>("chat/getConversation", async (receiverId, { rejectWithValue }) => {
    try {
        const res = await api.get(`/chat/conversation/${receiverId}`);
        console.log("🤖 Conversation thread fetched", res.data.data);
        return res.data.data;
    } catch {
        return rejectWithValue("Failed to fetch conversation");
    }
});

export const getMessages = createAsyncThunk<
    { conversationId: string; messages: Message[] },
    string,
    { rejectValue: string }
>("chat/getMessages", async (conversationId, { rejectWithValue }) => {
    try {
        const res = await api.get(`/chat/${conversationId}`);
        console.log("Received message: ", res.data);
        return { conversationId, messages: res.data.data.messages };
    } catch {
        return rejectWithValue("Failed to fetch messages");
    }
});
