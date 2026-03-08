import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
    Conversation,
    EditMessageResponse,
    LoadingState,
    Message,
} from "../../types/index";
import { chatThunk } from "./chatThunks";

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

        messageRead(
            state,
            action: PayloadAction<{ conversationId: string; readerId: string }>,
        ) {
            const { conversationId, readerId } = action.payload;

            const messages = state.messagesByConversation[conversationId];
            if (!messages) return;

            messages.forEach((msg) => {
                if (msg.senderId !== readerId) {
                    msg.read = true;
                }
            });
        },

        messageUpdated(state, action: PayloadAction<EditMessageResponse>) {
            const { conversationId, chatId, message, updatedAt } = action.payload;

            const messages = state.messagesByConversation[conversationId];

            if (!messages) return;

            const msg = messages.find((m) => m.id === chatId);

            if (msg) {
                msg.message = message;
                msg.updatedAt = updatedAt;
            }
        },

        messageDeleted(
            state,
            action: PayloadAction<{ chatId: string; conversationId: string }>,
        ) {
            const { chatId, conversationId } = action.payload;

            const messages = state.messagesByConversation[conversationId];
            if (!messages) return;

            const msg = messages.find((m) => m.id === chatId);

            if (msg) {
                msg.message = "This message was deleted";
                msg.isDeleted = true;
            }
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(chatThunk.sendMessage.pending, (state) => {
                state.status = "loading";
            })
            .addCase(chatThunk.sendMessage.fulfilled, (state, action) => {
                state.status = "succeeded";
                const msg = action.payload;

                state.activeConversationId = msg.conversationId;

                if (!state.messagesByConversation[msg.conversationId]) {
                    state.messagesByConversation[msg.conversationId] = [];
                }

                state.messagesByConversation[msg.conversationId].push(msg);
            })
            .addCase(chatThunk.sendMessage.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload ?? "Failed to send message";
            })

            .addCase(chatThunk.getResolveConversation.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(chatThunk.getResolveConversation.fulfilled, (state, action) => {
                state.status = "succeeded";

                const conversation = action.payload;

                state.conversationsById[conversation.id] = conversation;

                state.activeConversationId = conversation.id;
            })
            .addCase(chatThunk.getResolveConversation.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload ?? "Failed to fetch conversation";
            })

            .addCase(chatThunk.getMessages.pending, (state) => {
                state.status = "loading";
            })
            .addCase(chatThunk.getMessages.fulfilled, (state, action) => {
                console.log("FULFILLED PAYLOAD:", action.payload);
                state.status = "succeeded";
                const { conversationId, messages } = action.payload;

                state.messagesByConversation[conversationId] = Array.isArray(messages)
                    ? messages
                    : [];
            })
            .addCase(chatThunk.getMessages.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload ?? "Failed to load messages";
            })

            // Mark message as read
            .addCase(chatThunk.markMessagesAsRead.pending, (state) => {
                state.status = "loading";
            })

            .addCase(chatThunk.markMessagesAsRead.fulfilled, (state) => {
                state.status = "succeeded";
            })

            .addCase(chatThunk.markMessagesAsRead.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload ?? "Failed to mark messages as read";
            })

            // Edit message
            .addCase(chatThunk.editMessage.pending, (state) => {
                state.status = "loading";
            })
            .addCase(chatThunk.editMessage.fulfilled, (state, action) => {
                state.status = "succeeded";

                const updatedMsg = action.payload;

                const messages =
                    state.messagesByConversation[updatedMsg.conversationId];

                if (!messages) return;

                const index = messages.findIndex((msg) => msg.id === updatedMsg.chatId);

                if (index !== -1) {
                    messages[index].message = updatedMsg.message;
                    messages[index].updatedAt = updatedMsg.updatedAt;
                }
            })
            .addCase(chatThunk.editMessage.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload ?? "Failed to edit message";
            })

            // Delete message
            .addCase(chatThunk.deleteMessage.pending, (state) => {
                state.status = "loading";
            })
            .addCase(chatThunk.deleteMessage.fulfilled, (state, action) => {
                state.status = "succeeded";

                const deleteMsg = action.payload;

                const messages = state.messagesByConversation[deleteMsg.conversationId];

                if (!messages) return;

                const msg = messages.find((m) => m.id === deleteMsg.chatId);

                if (msg) {
                    msg.isDeleted = true;
                    msg.message = "This message was deleted";
                }
            })
            .addCase(chatThunk.deleteMessage.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload ?? "Failed to delete message";
            });
    },
});

export const {
    setActiveConversation,
    setSelectedUser,
    messageReceived,
    messageRead,
    messageUpdated,
    messageDeleted,
} = chatSlice.actions;

export default chatSlice.reducer;
