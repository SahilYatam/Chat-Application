import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";
import type {
    Message,
    Conversation,
    EditMessageResponse,
    DeleteMessageResponse,
} from "../../types/index";
import axios from "axios";

const sendMessage = createAsyncThunk<
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

const getResolveConversation = createAsyncThunk<
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

const getMessages = createAsyncThunk<
    { conversationId: string; messages: Message[]; nextCursor: string | null },
    { conversationId: string; cursor?: string },
    { rejectValue: string }
>(
    "chat/getMessages",
    async ({ conversationId, cursor }, { rejectWithValue }) => {
        try {
            const res = await api.get(`/chat/${conversationId}`, {
                params: {
                    cursor,
                    limit: 20,
                },
            });
            console.log("Received message: ", res.data);
            return {
                conversationId,
                messages: res.data.data.messages,
                nextCursor: res.data.data.nextCursor,
            };
        } catch {
            return rejectWithValue("Failed to fetch messages");
        }
    },
);

const editMessage = createAsyncThunk<
    EditMessageResponse,
    { chatId: string; conversationId: string; message: string },
    { rejectValue: string }
>(
    "chat/editMessage",
    async ({ chatId, conversationId, message }, { rejectWithValue }) => {
        try {
            const res = await api.patch(
                `/chat/edit-message/${chatId}/${conversationId}`,
                { message },
            );

            return res.data.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(
                    error.response?.data?.message ?? "Message editing failed",
                );
            }

            return rejectWithValue("Unexpected error while editing message");
        }
    },
);

const markMessagesAsRead = createAsyncThunk<
    { read: boolean; updatedCount: number },
    { conversationId: string },
    { rejectValue: string }
>("chat/markMessagesAsRead", async ({conversationId}, { rejectWithValue }) => {
    try {
        const res = await api.patch(`/chat/message-read/${conversationId}`);
        return res.data.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return rejectWithValue(
                error.response?.data?.message ?? "Mark message as read failed",
            );
        }

        return rejectWithValue("Unexpected error while marking message as read");
    }
});

const deleteMessage = createAsyncThunk<
    DeleteMessageResponse,
    { chatId: string; conversationId: string },
    { rejectValue: string }
>(
    "chat/deleteMessage",
    async ({ chatId, conversationId }, { rejectWithValue }) => {
        try {
            const res = await api.patch(
                `/chat/delete-message/${chatId}/${conversationId}`,
            );
            return res.data.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(
                    error.response?.data?.message ?? "Message deleting failed",
                );
            }

            return rejectWithValue("Unexpected error while deleting message");
        }
    },
);

export const chatThunk = {
    sendMessage,
    getResolveConversation,
    getMessages,
    editMessage,
    markMessagesAsRead,
    deleteMessage,
};
