import { ClientSession, Types } from "mongoose";
import {
    FriendRequest,
    FriendRequestSchemaType,
    FriendRequestStatus,
    FriendRequestDocument,
} from "./friendRequest.model.js";

type FriendRequestLean = FriendRequestSchemaType & {
    _id: Types.ObjectId;
};

export type FriendRequestEntity = {
    id: Types.ObjectId;
    senderId: Types.ObjectId;
    receiverId: Types.ObjectId;
    status: FriendRequestStatus;
    createdAt: Date;
    updatedAt: Date;
};

export type GetFriendRequests = {
    _id: Types.ObjectId;
    createdAt: Date;
    sender: {
        _id: Types.ObjectId;
        username: string;
        avatar?: string;
    };
};

type FriendRequestUserField = "senderId" | "receiverId";

const findByUserField = async (
    field: FriendRequestUserField,
    userId: Types.ObjectId,
): Promise<FriendRequestLean | null> => {
    return FriendRequest.findOne({ [field]: userId }).lean<FriendRequestLean>();
};

const findById = async (
    requestId: Types.ObjectId,
): Promise<FriendRequestLean | null> => {
    return FriendRequest.findById(requestId).lean<FriendRequestLean>();
};

const getFriendRequests = async (
    userId: Types.ObjectId,
): Promise<GetFriendRequests[] | []> => {
    const requests = await FriendRequest.find({
        receiverId: userId,
        status: FriendRequestStatus.PENDING,
    })
        .sort({createdAt: -1})
        .populate({
            path: "senderId",
            select: "username avatar"
        })
        .select("senderId createdAt")
        .lean();

    return requests.map((req: any) => ({
        _id: req._id,
        createdAt: req.createdAt,
        sender: req.senderId
    }))
};

const findBetweenUsers = async (
    userA: Types.ObjectId,
    userB: Types.ObjectId,
): Promise<FriendRequestLean | null> => {
    return FriendRequest.findOne({
        $or: [
            { senderId: userA, receiverId: userB },
            { senderId: userB, receiverId: userA },
        ],
    }).lean<FriendRequestLean>();
};

const createFriendRequest = async (
    senderId: Types.ObjectId,
    receiverId: Types.ObjectId,
): Promise<FriendRequestDocument> => {
    return FriendRequest.create({
        senderId,
        receiverId,
    });
};

const updateRequestStatus = async (
    requestId: Types.ObjectId,
    status: FriendRequestStatus.ACCEPTED | FriendRequestStatus.REJECTED,
    session?: ClientSession,
): Promise<FriendRequestDocument | null> => {
    return FriendRequest.findByIdAndUpdate(
        requestId,
        { status },
        {
            session,
            new: true,
        },
    );
};

export const friendRequestRepo = {
    findByUserField,
    findById,
    getFriendRequests,
    findBetweenUsers,
    createFriendRequest,
    updateRequestStatus,
};
