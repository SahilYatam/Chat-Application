import { Types } from "mongoose";
import { ApiError, logger } from "../../shared/index.js";
import { FriendRequestStatus } from "./friendRequest.model.js";
import { friendRequestRepo, GetFriendRequests } from "./friendRequest.repository.js";
import { userRepo } from "../user/user.repository.js";
import { friendshipRepo } from "../friendship/friendship.repository.js";
import { FriendshipStatus } from "../friendship/friendship.model.js";
import { NotificationType } from "../notification/notification.model.js";
import { notificationService } from "../notification/notification.service.js";

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

    const friendRequest = await friendRequestRepo.createFriendRequest(
        senderId,
        receiverId
    );

    try {
        await notificationService.createAndDispatch({
            receiverId,
            senderId,
            entityId: friendRequest._id,
            type: NotificationType.FRIEND_REQUEST_RECEIVED,
        });
    } catch (err: unknown) {
        logger.error("error while sending notification friend-request", err)
    }
};

const getFriendRequests = async(userId: Types.ObjectId): Promise<GetFriendRequests[]> => {
    const requests = await friendRequestRepo.getFriendRequests(userId);
    return requests
}

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
    const existingFriendship = await friendshipRepo.findFriendshipBetweenUsers(
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
                status: FriendshipStatus.ACTIVE,
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
        logger.error(
            "Error while accepting friend request",
            error.message,
            error.stack
        );
        throw error;
    } finally {
        session.endSession();
    }

    try {
        await notificationService.createAndDispatch({
            receiverId: request.senderId,
            senderId: currentUserId,
            entityId: requestId,
            type: NotificationType.FRIEND_REQUEST_ACCEPTED,
        });
    } catch (err: unknown) {
        logger.error("error while accept friendrequest notification", err)
    }
};

const rejectFriendRequest = async (
    requestId: Types.ObjectId,
    currentUserId: Types.ObjectId
): Promise<void> => {
    const request = await friendRequestRepo.findById(requestId);
    if (!request) throw new ApiError(404, "Friend request not found");

    // Authorization
    if (!request.receiverId.equals(currentUserId)) {
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

    const { userA, userB } = normalizeUsers(request.senderId, request.receiverId);

    const existingFriendship = await friendshipRepo.findFriendshipBetweenUsers(
        userA,
        userB
    );
    if (existingFriendship) throw new ApiError(409, "Friendship already exists");

    await friendRequestRepo.updateRequestStatus(
        requestId,
        FriendRequestStatus.REJECTED
    );

    try {
        await notificationService.createAndDispatch({
            receiverId: request.senderId,
            senderId: currentUserId,
            entityId: requestId,
            type: NotificationType.FRIEND_REQUEST_REJECTED,
        });
    } catch (err: unknown) {
         logger.error("error while reject friendrequest notification", err)
    }
};

export const friendRequestService = {
    sendFriendRequest,
    getFriendRequests,
    acceptFriendRequest,
    rejectFriendRequest,
};
