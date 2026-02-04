import { Request, Response } from "express";
import { userService } from "./user.service.js";
import { asyncHandler, ApiResponse } from "../../shared/index.js";
import { userSchema } from "./user.schema.js";

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

export const userController = {
    myProfile,
    searchUserByUsername,
};
