import { ClientSession, Types } from "mongoose";
import {
    Friendship,
    FriendshipDocument,
    FriendshipStatus,
} from "./friendship.model.js";

const normalized = (id: string | Types.ObjectId): Types.ObjectId => {
    return typeof id === "string" ? new Types.ObjectId(id) : id;
};

type CreateFriendshipInput = {
    userA: Types.ObjectId;
    userB: Types.ObjectId;
    createdBy: Types.ObjectId;
    status: FriendshipStatus;
};

const createFriendship = async (
    data: CreateFriendshipInput,
    session?: ClientSession
): Promise<FriendshipDocument> => {
    const [friendship] = await Friendship.create([data], { session });
    return friendship;
};

const findBetweenUsers = async (
    userA: string | Types.ObjectId,
    userB: string | Types.ObjectId
): Promise<FriendshipDocument | null> => {
    const a = normalized(userA);
    const b = normalized(userB);

    return Friendship.findOne({
        $or: [
            { userA: a, userB: b },
            { userA: b, userB: a },
        ],
    });
};

export const friendshipRepo = {
    createFriendship,
    findBetweenUsers,
};
