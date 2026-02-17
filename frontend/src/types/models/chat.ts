export interface Conversation {
    id: string;
    participants: string[];
    createdAt: string;
    updatedAt: string;
}

export interface Message {
    chatId: string;
    conversationId: string;
    senderId: string;
    message: string;
    messageType: "text" | "file" | "image";
    editedAt?: string;
    read: boolean;
    isDeleted: boolean;
    createdAt: string
}