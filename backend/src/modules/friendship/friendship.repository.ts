import { ClientSession, Types } from "mongoose";
import {
    Friendship,
    FriendshipSchemaType,
    FriendshipStatus,
    FriendshipDocument
} from "./friendship.model.js";
import { normalizeObjectId } from "../../shared/index.js";


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

const findFriendshipBetweenUsers = async (
    userA: Types.ObjectId,
    userB: Types.ObjectId
): Promise<FriendshipSchemaType | null> => {
    const a = normalizeObjectId(userA);
    const b = normalizeObjectId(userB);

    return Friendship.findOne({
        $or: [
            { userA: a, userB: b },
            { userA: b, userB: a },
        ],
    }).lean<FriendshipSchemaType>();
};

export const friendshipRepo = {
    createFriendship,
    findFriendshipBetweenUsers,
};
