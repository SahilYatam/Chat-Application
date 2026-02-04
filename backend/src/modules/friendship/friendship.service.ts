import { Types } from "mongoose";
import { friendshipRepo } from "./friendship.repository.js";
import { userRepo } from "../user/user.repository.js";

const getFriendList = async (currentUserId: Types.ObjectId) => {
    const friendships = await friendshipRepo.getFriendList(currentUserId);

    const friendIds = friendships.map((friend) =>
        friend.userA.equals(currentUserId) ? friend.userB : friend.userA,
    );

    // Removed possible duplicates for safety
    const uniqueFriendIds = Array.from(
        new Map(friendIds.map((id) => [id.toString(), id])).values(),
    );

    const users = await userRepo.findUsersByIds(uniqueFriendIds);

    return users.map((user) => ({
        userId: user._id,
        username: user.username,
        avatar: user.avatar,
    }));
};

export const friendshipService = {
    getFriendList
}
