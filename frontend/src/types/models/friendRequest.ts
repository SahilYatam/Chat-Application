
export type FriendRequest = {
    id: string;
    senderId: string;
    receiverId: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export type FriendshipStatus =
    | "none"
    | "friends"
    | "pending_incoming"
    | "pending_outgoing"
    | null;