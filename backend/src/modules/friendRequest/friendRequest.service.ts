import { Types } from "mongoose";
import { ApiError, logger } from "../../shared/index.js";
import { FriendRequestStatus } from "./friendRequest.model.js";
import { friendRequestRepo } from "./friendRequest.repository.js";
import { userRepo } from "../user/user.repository.js";
import { friendshipRepo } from "../friendship/friendship.repository.js";
import { FriendshipStatus } from "../friendship/friendship.model.js";

import mongoose from "mongoose";

const normalizeUsers = (a: Types.ObjectId, b: Types.ObjectId) => {
    return a.toString() < b.toString()
        ? { userA: a, userB: b }
        : { userA: b, userB: a };
};

const sendFriendRequest = async (
    senderId: Types.ObjectId,
    receiverId: Types.ObjectId
): Promise<void> => {
    // 1. Prevent self-request
    if (senderId.equals(receiverId)) {
        throw new ApiError(400, "You cannot send a friend request to yourself");
    }

    // 2. Ensuring receiver exists (USER responsibility)
    const receiverExists = await userRepo.findUserById(receiverId);
    if (!receiverExists) throw new ApiError(404, "User not found");

    // 3. Check existing relationship (FRIEND REQUEST responsibility)
    const existingRequest = await friendRequestRepo.findBetweenUsers(
        senderId,
        receiverId
    );

    if (existingRequest) {
        switch (existingRequest.status) {
            case FriendRequestStatus.PENDING:
                throw new ApiError(409, "Friend request already sent");

            case FriendRequestStatus.ACCEPTED:
                throw new ApiError(409, "You are already friends");

            case FriendRequestStatus.REJECTED:
                throw new ApiError(409, "Friend request was already rejected");
        }
    }

    await friendRequestRepo.createFriendRequest(senderId, receiverId);
};

const acceptFriendRequest = async (
    requestId: Types.ObjectId,
    currentUserId: Types.ObjectId
): Promise<void> => {
    const request = await friendRequestRepo.findById(requestId);
    if (!request) throw new ApiError(404, "Friend request not found");

    // Authorization: only reciver can accept
    if (!request.receiverId.equals(currentUserId)) {
        throw new ApiError(
            403,
            "You are not allowed to accept this friend request"
        );
    }

    // State validation
    if (request.status !== FriendRequestStatus.PENDING) {
        switch (request.status) {
            case FriendRequestStatus.ACCEPTED:
                throw new ApiError(409, "You are already friends");
            case FriendRequestStatus.REJECTED:
                throw new ApiError(409, "Friend request was already rejected");
        }
    }

    const { userA, userB } = normalizeUsers(request.senderId, request.receiverId);

    // Check if friendship already exists
    const existingFriendship = await friendshipRepo.findBetweenUsers(
        userA,
        userB
    );
    if (existingFriendship) throw new ApiError(409, "Friendship already exists");

    // Transation start here
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        await friendshipRepo.createFriendship(
            {
                userA,
                userB,
                createdBy: currentUserId,
                status: FriendshipStatus.ACTIVE
            },
            session
        );

        await friendRequestRepo.updateRequestStatus(
            requestId,
            FriendRequestStatus.ACCEPTED,
            session
        );

        await session.commitTransaction();
    } catch (err: unknown) {
        const error = err as Error;
        await session.abortTransaction();
        logger.error("Error while accepting friend request", error.message, error.stack);
        throw error;
    } finally {
        session.endSession();
    }
    
};

const rejectFriendRequest = async(
    requestId: Types.ObjectId,
    currentUserId: Types.ObjectId
): Promise<void> => {
    const request = await friendRequestRepo.findById(requestId);
    if(!request) throw new ApiError(404, "Friend request not found");

    // Authorization
    if(!request.receiverId.equals(currentUserId)){
        throw new ApiError(
            403,
            "You are not allowed to reject this friend request"
        );
    }

    // State validation
    if (request.status !== FriendRequestStatus.PENDING) {
        switch (request.status) {
            case FriendRequestStatus.ACCEPTED:
                throw new ApiError(409, "You are already friends");
            case FriendRequestStatus.REJECTED:
                throw new ApiError(409, "Friend request was already rejected");
        }
    }

    const {userA, userB} = normalizeUsers(request.senderId, request.receiverId);


    const existingFriendship = await friendshipRepo.findBetweenUsers(userA, userB);
    if (existingFriendship) throw new ApiError(409, "Friendship already exists");

    await friendRequestRepo.updateRequestStatus(requestId, FriendRequestStatus.REJECTED);
}

export const friendRequestService = {
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest
}
