import { MessageCircle } from "lucide-react";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import SendFriendRequest from "../friendRequest/SendFriendRequest";
import RequestPending from "../friendRequest/RequestPending";
import { friendRequestThunks } from "../../features/friendRequest/friendRequestThunks";
import { useEffect } from "react";
import AcceptOrRejectRequest from "../friendRequest/AcceptOrRejectRequest";
import { clearActiveEntity } from "../../features/notification/notification.slices";

const MessageContainer = () => {
    const dispatch = useAppDispatch();

    const selectedUserId = useAppSelector((state) => state.chat.selectedUserId);

    const selectedUser = useAppSelector((state) =>
        state.user.users.find((u) => u._id === selectedUserId),
    );

    const activeEntity = useAppSelector(
        (state) => state.notification.activeEntity,
    );

    useEffect(() => {
        if (selectedUserId) {
            dispatch(friendRequestThunks.getFriendshipStatus(selectedUserId));
        }
    }, [dispatch, selectedUserId]);

    const friendshipStatus = useAppSelector((state) =>
        selectedUserId
            ? (state.friendRequest.friendshipByUserId[selectedUserId] ?? "none")
            : "none",
    );

    const handleSendFriendRequest = async () => {
        if (selectedUserId) {
            await dispatch(friendRequestThunks.sendFriendRequest(selectedUserId));
        }
    };

    // No chat selected
    if (!selectedUserId) {
        return <NoChatSelected />;
    }

    if (friendshipStatus === "none") {
        return (
            <div className="flex-1 flex items-center justify-center">
                <SendFriendRequest
                    onSend={handleSendFriendRequest}
                    username={selectedUser?.username}
                />
            </div>
        );
    }

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

    const onAccept = async (requestId: string) => {
        await dispatch(friendRequestThunks.acceptFriendRequest(requestId));
        dispatch(clearActiveEntity());
    };

    const onReject = async (requestId: string) => {
        await dispatch(friendRequestThunks.rejectFriendRequest(requestId));
        dispatch(clearActiveEntity());
    };

    if (
        activeEntity?.type === "FRIEND_REQUEST_RECEIVED" &&
        activeEntity.entityId &&
        activeEntity.senderUsername
    ) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <AcceptOrRejectRequest
                    username={activeEntity.senderUsername}
                    requestId={activeEntity.entityId}
                    onAccept={onAccept}
                    onReject={onReject}
                />
            </div>
        );
    }

    return (
        <div className="flex flex-col w-96">
            <div className="bg-slate-500 px-4 py-2 mb-2">
                <span className="label-text">To:</span>{" "}
                <span className="text-gray-900 font-bold">
                    {selectedUser?.username}
                </span>
            </div>
            <Messages />
            <MessageInput />
        </div>
    );
};

export default MessageContainer;

const NoChatSelected = () => {
    const authUser = useAppSelector((state) => state.auth.user);
    console.log("user:", authUser);
    console.log("username:", authUser?.username);

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
