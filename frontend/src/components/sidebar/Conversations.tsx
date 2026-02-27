import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { setSelectedUser } from "../../features/chat/chatSlices";
import { userThunks } from "../../features/user/userThunks";
import Conversation from "./Conversation";
import { friendRequestThunks } from "../../features/friendRequest/friendRequestThunks";

const Conversations = () => {
    const dispatch = useAppDispatch();

    const { users, status, error } = useAppSelector((s) => s.user);

    useEffect(() => {
        dispatch(userThunks.getAllUserForSidePanel());
    }, [dispatch]);

    const handleSelectUser = (userId: string) => {
        dispatch(setSelectedUser(userId));

        // Also check friendship status
        dispatch(friendRequestThunks.getFriendshipStatus(userId));
    };

    if (status === "loading") {
        return <p className="text-gray-400 p-4">Loading...</p>;
    }

    if (status === "failed") {
        return <p className="text-red-500 p-4">{error}</p>;
    }

    return (
        <div className="flex flex-col overflow-y-auto no-scrollbar">
            {users?.map((user) => (
                <Conversation
                    key={user._id}
                    id={user._id}
                    avatar={user.avatar}
                    username={user.username}
                    selectUser={handleSelectUser}
                />
            ))}
        </div>
    );
};
export default Conversations;
