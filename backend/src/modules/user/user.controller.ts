import { Request, Response } from "express";
import { userService } from "./user.service.js";
import { asyncHandler, ApiResponse } from "../../shared/index.js";
import { userSchema } from "./user.schema.js";
import { userRepo } from "./user.repository.js";

const myProfile = asyncHandler(async (req: Request, res: Response) => {
    const id = req.user._id;

    const user = await userService.myProfile(id);

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Profile fetched successfully"));
});

const searchUserByUsername = asyncHandler(
    async (req: Request, res: Response) => {
        const { username } = userSchema.findUserByUsernameSchema.parse(req.query);

        const user = await userService.searchUserByUsername(username);

        return res
            .status(200)
            .json(new ApiResponse(200, user, "User found successfully"));
    },
);

const getAllUserForSidePanel = asyncHandler(
    async (req: Request, res: Response) => {
        const currentUserId = req.user._id;
        const users = await userRepo.getAllUserForSidePanel(currentUserId);

        const formattedUsers = users.map((user) => ({
            id: user._id,
            username: user.username,
            avatar: user.avatar
        }))

        return res
            .status(200)
            .json(new ApiResponse(200, formattedUsers, "All users fetched"));
    },
);

export const userController = {
    myProfile,
    searchUserByUsername,
    getAllUserForSidePanel,
};
