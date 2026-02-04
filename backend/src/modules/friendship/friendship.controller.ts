import { Request, Response } from "express";
import { ApiResponse, asyncHandler } from "../../shared/index.js";
import { friendshipService } from "./friendship.service.js";

const getFriendList = asyncHandler(async (req: Request, res: Response) => {
    const currentUserId = req.user._id;

    const friendList = await friendshipService.getFriendList(currentUserId);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                friendList,
                friendList.length
                    ? "Friend list fetched successfully"
                    : "No friends yet",
            ),
        );
});

export const friendshipController = {
    getFriendList,
};
