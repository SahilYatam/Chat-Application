import { MessageCircle } from "lucide-react";
import { useEffect } from "react";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import SendFriendRequest from "../friendRequest/SendFriendRequest";
import RequestPending from "../friendRequest/RequestPending";
import AcceptOrRejectRequest from "../friendRequest/AcceptOrRejectRequest";
import { friendRequestThunks } from "../../features/friendRequest/friendRequestThunks";
import { clearActiveEntity } from "../../features/notification/notification.slices";
import { setSelectedUser } from "../../features/chat/chatSlices";

import { getMessages, getResolveConversation } from "../../features/chat/chatThunks";

const MessageContainer = () => {
    const dispatch = useAppDispatch();

    const selectedUserId = useAppSelector(state => state.chat.selectedUserId);
    const activeEntity = useAppSelector(state => state.notification.activeEntity);

    const selectedUser = useAppSelector(state =>
        state.user.users.find(u => u._id === selectedUserId)
    );

    const friendshipStatus = useAppSelector(state =>
        selectedUserId
            ? state.friendRequest.friendshipByUserId[selectedUserId]
            : undefined
    );

    const isLoading = useAppSelector(state =>
        selectedUserId
            ? state.friendRequest.friendshipLoadingByUserId[selectedUserId]
            : false
    );

    const activeConversationId = useAppSelector(
        state => state.chat.activeConversationId
    )

    // 🔍 DEBUG LOGS
    console.log("🧠 selectedUserId:", selectedUserId);
    console.log("🤝 friendshipStatus:", friendshipStatus);
    console.log("⏳ isLoading:", isLoading);
    console.log("🔔 activeEntity:", activeEntity);

    useEffect(() => {
        if (!selectedUserId) return;

        console.log("📡 fetching friendship status for:", selectedUserId);
        dispatch(friendRequestThunks.getFriendshipStatus(selectedUserId));
    }, [dispatch, selectedUserId]);

    useEffect(() => {
        if(!selectedUserId) return;

        // it will only resolve conversation if they are friends
        if(friendshipStatus === "friends"){
            dispatch(getResolveConversation(selectedUserId))
        }

    }, [dispatch, selectedUserId, friendshipStatus]);

    useEffect(() => {
        if(!activeConversationId) return;
        dispatch(getMessages(activeConversationId))
    }, [dispatch, activeConversationId])

    // 1️⃣ Notification has top priority
    if (activeEntity?.type === "FRIEND_REQUEST_RECEIVED") {
        return (
            <div className="flex-1 flex items-center justify-center">
                <AcceptOrRejectRequest
                    username={activeEntity.senderUsername}
                    requestId={activeEntity.entityId}
                    onAccept={async (requestId) => {
                        const res = await dispatch(
                            friendRequestThunks.acceptFriendRequest(requestId)
                        ).unwrap();

                        dispatch(clearActiveEntity());
                        dispatch(setSelectedUser(res.friendId));
                    }}
                    onReject={async (requestId) => {
                        await dispatch(friendRequestThunks.rejectFriendRequest(requestId));
                        dispatch(clearActiveEntity());
                    }}
                />
            </div>
        );
    }

    // 2️⃣ No user selected
    if (!selectedUserId) {
        return <NoChatSelected />;
    }

    // 3️⃣ Loading state (NEVER return null)
    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center text-gray-400">
                Loading...
            </div>
        );
    }

    // 4️⃣ Status still unknown → treat as "none"
    if (!friendshipStatus) {
        console.warn("⚠️ friendshipStatus undefined → fallback to SendFriendRequest");
        return (
            <div className="flex-1 flex items-center justify-center">
                <SendFriendRequest
                    onSend={() =>
                        selectedUserId &&
                        dispatch(friendRequestThunks.sendFriendRequest(selectedUserId))
                    }
                    username={selectedUser?.username}
                />
            </div>
        );
    }

    // 5️⃣ None
    if (friendshipStatus === "none") {
        return (
            <div className="flex-1 flex items-center justify-center">
                <SendFriendRequest
                    onSend={() =>
                        selectedUserId &&
                        dispatch(friendRequestThunks.sendFriendRequest(selectedUserId))
                    }
                    username={selectedUser?.username}
                />
            </div>
        );
    }

    // 6️⃣ Pending
    if (
        friendshipStatus === "pending_outgoing" ||
        friendshipStatus === "pending_incoming"
    ) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <RequestPending />
            </div>
        );
    }

    // 7️⃣ Friends → Chat
    return (
        <div className="flex flex-col w-full">
            <div className="bg-slate-500 px-4 py-2">
                <span className="label-text">To:</span>{" "}
                <span className="font-bold">{selectedUser?.username}</span>
            </div>
            <Messages />
            <MessageInput />
        </div>
    );
};

export default MessageContainer;

/* ---------- NO CHAT SELECTED ---------- */

const NoChatSelected = () => {
    const authUser = useAppSelector((state) => state.auth.user);

    return (
        <div className="flex items-center justify-center w-full h-full">
            <div className="px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2">
                <p>Welcome 👋 {authUser?.username} ❄</p>
                <p>Select a chat to start messaging</p>
                <MessageCircle className="text-3xl md:text-6xl text-center" />
            </div>
        </div>
    );
};