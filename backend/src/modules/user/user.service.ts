import { Types } from "mongoose";
import { userRepo } from "./user.repository.js";
import { ApiError } from "../../shared/index.js";

const myProfile = async (id: Types.ObjectId) => {
    const user = await userRepo.findUserById(id);

    if (!user) throw new ApiError(404, "User not found");

    return {
        id: user._id.toString(),
        username: user.username,
        name: user.name,
        avatar: user.avatar,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
};

const searchUserByUsername = async (username: string) => {
    const users = await userRepo.searchUsersByUsername(username);

    if (!users || users.length === 0) {
        throw new ApiError(404, "User not found")
    }

    return users.map((user) => ({
        id: user._id.toString(),
        username: user.username,
        avatar: user.avatar
    }))
};


export const userService = {
    myProfile,
    searchUserByUsername,
};
