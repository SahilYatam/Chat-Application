export interface Conversation {
    id: string;
    participants: string[];
    createdAt: string;
    updatedAt: string;
}

export interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    message: string;
    messageType: "text" | "file" | "image";
    editedAt?: string;
    read: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface EditMessageResponse {
    chatId: string;
    conversationId: string;
    message: string;
    createdAt: string;
    updatedAt: string;
}
export interface DeleteMessageResponse {
    chatId: string;
    conversationId: string;
    message: string;
    createdAt: string;
    isDeleted: boolean;
}
