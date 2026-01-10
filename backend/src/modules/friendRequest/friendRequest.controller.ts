import { Request, Response } from "express";
import { ApiResponse, asyncHandler } from "../../shared/index.js";
import { friendRequestSchema } from "./friendRequest.schema.js";
import { friendRequestService } from "./friendRequest.service.js";
import { Types } from "mongoose";

const sendFriendRequest = asyncHandler(async (req: Request, res: Response) => {
    const senderId = req.user?._id;
    const { receiverId } = friendRequestSchema.sendFriendRequestSchema.parse(
        req.params.id
    );

    await friendRequestService.sendFriendRequest(
        new Types.ObjectId(senderId),
        new Types.ObjectId(receiverId)
    );

    return res
        .status(201)
        .json(new ApiResponse(200, {}, "Friend request sent successfully"));
});

const acceptFriendRequest = asyncHandler(
    async (req: Request, res: Response) => {
        const currentUserId = req.user?._id;
        const { requestId } = friendRequestSchema.acceptFriendRequestSchema.parse(
            req.params.id
        );

        await friendRequestService.acceptFriendRequest(
            new Types.ObjectId(requestId),
            new Types.ObjectId(currentUserId)
        );

        return res
            .status(201)
            .json(new ApiResponse(200, {}, "Friend request accepted successfully"));
    }
);

const rejectFriendRequest = asyncHandler(
    async (req: Request, res: Response) => {
        const currentUserId = req.user?._id;
        const { requestId } = friendRequestSchema.rejectFriendRequestSchema.parse(
            req.params.id
        );

        await friendRequestService.rejectFriendRequest(
            new Types.ObjectId(requestId),
            new Types.ObjectId(currentUserId)
        );

        return res
            .status(201)
            .json(new ApiResponse(200, {}, "Friend request rejected successfully"));
    }
);

export const friendRequestController = {
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
};
