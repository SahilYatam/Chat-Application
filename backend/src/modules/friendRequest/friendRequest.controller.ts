import { Request, Response } from "express";
import { ApiResponse, asyncHandler } from "../../shared/index.js";
import { friendRequestSchema } from "./friendRequest.schema.js";
import { friendRequestService } from "./friendRequest.service.js";
import { Types } from "mongoose";

const sendFriendRequest = asyncHandler(async (req: Request, res: Response) => {
    const senderId = req.user._id;
    const { receiverId } = friendRequestSchema.sendFriendRequestSchema.parse(
        req.params,
    );

    await friendRequestService.sendFriendRequest(
        senderId,
        new Types.ObjectId(receiverId),
    );

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Friend request sent successfully"));
});

const getFriendRequests = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user._id;

    const requests = await friendRequestService.getFriendRequests(userId);

    const message =
        requests.length === 0 ? "No friend request yet" : "Friend request fetched";

    return res.status(200).json(new ApiResponse(200, { requests }, message));
});

const acceptFriendRequest = asyncHandler(
    async (req: Request, res: Response) => {
        const currentUserId = req.user._id;
        const { requestId } = friendRequestSchema.acceptFriendRequestSchema.parse(
            req.params,
        );

        await friendRequestService.acceptFriendRequest(
            new Types.ObjectId(requestId),
            currentUserId,
        );

        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Friend request accepted successfully"));
    },
);

const rejectFriendRequest = asyncHandler(
    async (req: Request, res: Response) => {
        const currentUserId = req.user._id;
        const { requestId } = friendRequestSchema.rejectFriendRequestSchema.parse(
            req.params,
        );

        await friendRequestService.rejectFriendRequest(
            new Types.ObjectId(requestId),
            currentUserId,
        );

        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Friend request rejected successfully"));
    },
);

export const friendRequestController = {
    sendFriendRequest,
    getFriendRequests,
    acceptFriendRequest,
    rejectFriendRequest,
};
