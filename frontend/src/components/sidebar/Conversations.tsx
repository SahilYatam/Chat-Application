import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { setSelectedUser } from "../../features/chat/chatSlices";
import { userThunks } from "../../features/user/userThunks";
import Conversation from "./Conversation";
import { friendRequestThunks } from "../../features/friendRequest/friendRequestThunks";

import type { TabType } from "./UserFilterTabs";
import { friendshipThunk } from "../../features/friendship/friendship.thunks";

interface ConversationsProps {
  activeTab: TabType;
}

const Conversations = ({ activeTab }: ConversationsProps) => {
  const dispatch = useAppDispatch();

  const {
    users,
    status: userStatus,
    error: userError,
  } = useAppSelector((s) => s.user);

  const {
    friends,
    status: friendStatus,
    error: friendError,
  } = useAppSelector((s) => s.friendship);

  useEffect(() => {
    if (activeTab === "global" && users.length === 0) {
      dispatch(userThunks.getAllUserForSidePanel());
    }

    if (activeTab === "friends" && friends.length === 0) {
      dispatch(friendshipThunk.getFriendList());
    }
  }, [dispatch, activeTab]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSelectUser = (id: string) => {
    console.log("SELECT USER:", id);
    dispatch(setSelectedUser(id));

    // Also check friendship status
    dispatch(friendRequestThunks.getFriendshipStatus(id));
  };

  const data = activeTab === "global" ? users : friends;
  const status = activeTab === "global" ? userStatus : friendStatus;
  const error = activeTab === "global" ? userError : friendError;
  console.log("DATA:", data);
  if (status === "loading") {
    return <p className="text-gray-400 p-4">Loading...</p>;
  }

  if (status === "failed") {
    return <p className="text-red-500 p-4">{error}</p>;
  }

  return (
    <div className="flex flex-col overflow-y-auto no-scrollbar">
      {data?.map((user) => {
        console.log("USER OBJECT:", user);

        return (
          <Conversation
            key={user.id}
            id={user.id}
            avatar={user.avatar}
            username={user.username}
            selectUser={handleSelectUser}
          />
        );
      })}
    </div>
  );
};
export default Conversations;
