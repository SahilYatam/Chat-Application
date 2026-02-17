import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Message } from "../../types/index";
import { getMessages } from "./chatThunks";

interface ChatState {
    messagesByConversation: Record<string, Message[]>;
    activeConversationId: string | null;
    status: "idle" | "loading" | "failed";
    error: string | null;
}

const initialState: ChatState = {
    messagesByConversation: {},
    activeConversationId: null,
    status: "idle",
    error: null
}

const chatSlice = createSlice({
    name: "chat",
    initialState,

    reducers: {
        setActiveConversation(state, action: PayloadAction<string>){
            state.activeConversationId = action.payload;
        },

        messageReceived(state, action){
            const msg = action.payload;

            if(!state.messagesByConversation[msg.conversationId]){
                state.messagesByConversation[msg.conversationId] = []
            }

            state.messagesByConversation[msg.conversationId].push(msg);

        },

        messageUpdated(state, action: PayloadAction<Message>) {
            const messages = state.messagesByConversation[action.payload.conversationId];

            if(!messages) return;

            const index = messages.findIndex(m => m.chatId === action.payload.chatId);

            if(index !== -1) messages[index] = action.payload;
        },

        messageDeleted(
            state,
            action: PayloadAction<{conversationId: string; chatId: string}>
        ) {
            const messages = state.messagesByConversation[action.payload.conversationId];

            if(!messages) return;

            const msg = messages.find(m => m.chatId === action.payload.chatId);
            if(msg) msg.isDeleted = true
        }

    },

    extraReducers: (builder) => {
        builder
            .addCase(getMessages.pending, (state) => {
                state.status = "loading";
            })
            .addCase(getMessages.fulfilled, (state, action) => {
                state.status = "idle";
                state.messagesByConversation[action.payload.conversationId] = action.payload.messages;
            })
            .addCase(getMessages.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload ?? "Failed to load messages"
            })
    }
});

export const {
    setActiveConversation,
    messageReceived,
    messageUpdated,
    messageDeleted
} = chatSlice.actions; 

export default chatSlice.reducer;
