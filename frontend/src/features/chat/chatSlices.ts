import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Conversation, LoadingState, Message } from "../../types/index";
import { getMessages, getResolveConversation, sendMessageThunk } from "./chatThunks";

interface ChatState {
    conversationsById: Record<string, Conversation>;
    messagesByConversation: Record<string, Message[]>;
    activeConversationId: string | null;
    selectedUserId: string | null;
    status: LoadingState;
    error: string | null;
}

const initialState: ChatState = {
    conversationsById: {},
    messagesByConversation: {},
    activeConversationId: null,
    selectedUserId: null,
    status: "idle",
    error: null,
};

const chatSlice = createSlice({
    name: "chat",
    initialState,

    reducers: {
        setActiveConversation(state, action: PayloadAction<string>) {
            state.activeConversationId = action.payload;
        },

        setSelectedUser(state, action) {
            state.selectedUserId = action.payload;
        },

        messageReceived(state, action) {
            const msg = action.payload;
            const converId = msg.conversationId;

            if (!state.messagesByConversation[converId]) {
                state.messagesByConversation[converId] = [];
            }

            state.messagesByConversation[converId].push(msg);
        },

        messageUpdated(state, action: PayloadAction<Message>) {
            const messages =
                state.messagesByConversation[action.payload.conversationId];

            if (!messages) return;

            const index = messages.findIndex(
                (m) => m.id === action.payload.id,
            );

            if (index !== -1) messages[index] = action.payload;
        },

        messageDeleted(
            state,
            action: PayloadAction<{ conversationId: string; chatId: string }>,
        ) {
            const messages =
                state.messagesByConversation[action.payload.conversationId];

            if (!messages) return;

            const msg = messages.find((m) => m.id === action.payload.chatId);
            if (msg) msg.isDeleted = true;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(sendMessageThunk.pending, (state) => {
                state.status = "loading";
            })
            .addCase(sendMessageThunk.fulfilled, (state, action) => {
                state.status = "succeeded";
                const msg = action.payload;

                state.activeConversationId = msg.conversationId;

                if (!state.messagesByConversation[msg.conversationId]) {
                    state.messagesByConversation[msg.conversationId] = [];
                }

                state.messagesByConversation[msg.conversationId].push(msg);
            })
            .addCase(sendMessageThunk.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload ?? "Failed to send message";
            })

            .addCase(getResolveConversation.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(getResolveConversation.fulfilled, (state, action) => {
                state.status = "succeeded";

                const conversation = action.payload

                state.conversationsById[conversation.id] = conversation

                state.activeConversationId = conversation.id
            })
            .addCase(getResolveConversation.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload ?? "Failed to fetch conversation";
            })

            .addCase(getMessages.pending, (state) => {
                state.status = "loading";
            })
            .addCase(getMessages.fulfilled, (state, action) => {
                console.log("FULFILLED PAYLOAD:", action.payload);
                state.status = "succeeded";
                const { conversationId, messages } = action.payload;

                // Hard guard against backend shape corruption
                state.messagesByConversation[conversationId] = Array.isArray(messages)
                    ? messages
                    : [];
            })
            .addCase(getMessages.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload ?? "Failed to load messages";
            });
    },
});

export const {
    setActiveConversation,
    setSelectedUser,
    messageReceived,
    messageUpdated,
    messageDeleted,
} = chatSlice.actions;

export default chatSlice.reducer;
