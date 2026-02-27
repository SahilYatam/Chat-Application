import { Types } from "mongoose";
import { ApiError, logger } from "../../shared/index.js";
import { FriendRequestStatus } from "./friendRequest.model.js";
import type {
    FriendRequestEntity,
    GetFriendRequests,
} from "./friendRequest.repository.js";
import { friendRequestRepo } from "./friendRequest.repository.js";
import { userRepo } from "../user/user.repository.js";
import { friendshipRepo } from "../friendship/friendship.repository.js";
import { FriendshipStatus } from "../friendship/friendship.model.js";
import { NotificationType } from "../notification/notification.model.js";
import { notificationService } from "../notification/notification.service.js";

import mongoose from "mongoose";
import { GetFriendshipStatus } from "./friendRequest.types.js";

const normalizeUsers = (a: Types.ObjectId, b: Types.ObjectId) => {
    return a.toString() < b.toString()
        ? { userA: a, userB: b }
        : { userA: b, userB: a };
};

const sendFriendRequest = async (
    senderId: Types.ObjectId,
    receiverId: Types.ObjectId,
): Promise<FriendRequestEntity> => {
    // 1. Prevent self-request
    if (senderId.equals(receiverId)) {
        throw new ApiError(400, "You cannot send a friend request to yourself");
    }

    const username = await userRepo.findUsernameById(senderId);

    // 2. Ensuring receiver exists (USER responsibility)
    const receiverExists = await userRepo.findUserById(receiverId);
    if (!receiverExists) throw new ApiError(404, "User not found");

    // 3. Check existing relationship (FRIEND REQUEST responsibility)
    const existingRequest = await friendRequestRepo.findBetweenUsers(
        senderId,
        receiverId,
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
        receiverId,
    );

    try {
        await notificationService.createAndDispatch({
            receiverId,
            senderId,
            entityId: friendRequest._id,
            type: NotificationType.FRIEND_REQUEST_RECEIVED,
            senderUsername: username || "",
        });
    } catch (err: unknown) {
        logger.error("error while sending notification friend-request", err);
    }
    const entity: FriendRequestEntity = {
        id: friendRequest._id,
        senderId: friendRequest.senderId,
        receiverId: friendRequest.receiverId,
        senderUsername: username || "",
        status: friendRequest.status,
        createdAt: friendRequest.createdAt,
        updatedAt: friendRequest.updatedAt,
    };

    return entity;
};

const getFriendRequests = async (
    userId: Types.ObjectId,
): Promise<GetFriendRequests[]> => {
    const requests = await friendRequestRepo.getFriendRequests(userId);
    return requests;
};

const acceptFriendRequest = async (
    requestId: Types.ObjectId,
    currentUserId: Types.ObjectId,
): Promise<void> => {
    const request = await friendRequestRepo.findById(requestId);
    if (!request) throw new ApiError(404, "Friend request not found");

    const username = await userRepo.findUsernameById(currentUserId);

    // Authorization: only reciver can accept
    if (!request.receiverId.equals(currentUserId)) {
        throw new ApiError(
            403,
            "You are not allowed to accept this friend request",
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
        userB,
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
            session,
        );

        await friendRequestRepo.updateRequestStatus(
            requestId,
            FriendRequestStatus.ACCEPTED,
            session,
        );

        await session.commitTransaction();
    } catch (err: unknown) {
        const error = err as Error;
        await session.abortTransaction();
        logger.error(
            "Error while accepting friend request",
            error.message,
            error.stack,
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
            senderUsername: username || "",
        });
    } catch (err: unknown) {
        logger.error("error while accept friendrequest notification", err);
    }
};

const rejectFriendRequest = async (
    requestId: Types.ObjectId,
    currentUserId: Types.ObjectId,
): Promise<void> => {
    const request = await friendRequestRepo.findById(requestId);
    if (!request) throw new ApiError(404, "Friend request not found");

    const username = await userRepo.findUsernameById(currentUserId);

    // Authorization
    if (!request.receiverId.equals(currentUserId)) {
        throw new ApiError(
            403,
            "You are not allowed to reject this friend request",
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
        userB,
    );
    if (existingFriendship) throw new ApiError(409, "Friendship already exists");

    await friendRequestRepo.updateRequestStatus(
        requestId,
        FriendRequestStatus.REJECTED,
    );

    try {
        await notificationService.createAndDispatch({
            receiverId: request.senderId,
            senderId: currentUserId,
            entityId: requestId,
            type: NotificationType.FRIEND_REQUEST_REJECTED,
            senderUsername: username || "",
        });
    } catch (err: unknown) {
        logger.error("error while reject friendrequest notification", err);
    }
};

const getFriendshipStatus = async (
    currentUserId: Types.ObjectId,
    otherUserId: Types.ObjectId,
): Promise<GetFriendshipStatus> => {
    const friendship = await friendRequestRepo.findBetweenUsers(
        currentUserId,
        otherUserId,
    );

    if (!friendship) return "none";

    if (friendship.status === FriendRequestStatus.ACCEPTED) return "friends";

    if (friendship.status === FriendRequestStatus.REJECTED) return "rejected";

    if (friendship.status === FriendRequestStatus.PENDING) {
        const isSender =
            friendship.senderId.toString() === currentUserId.toString();

        return isSender ? "pending_outgoing" : "pending_incoming";
    }

    return "none";
};

export const friendRequestService = {
    sendFriendRequest,
    getFriendRequests,
    acceptFriendRequest,
    rejectFriendRequest,
    getFriendshipStatus,
};
