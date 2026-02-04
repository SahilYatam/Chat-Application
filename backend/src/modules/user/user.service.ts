import { Types } from "mongoose";
import { userRepo } from "./user.repository.js";
import { ApiError } from "../../shared/index.js";

const myProfile = async (id: Types.ObjectId) => {
    const user = await userRepo.findUserById(id);

    if (!user) throw new ApiError(404, "User not found");

    return user;
};

const searchUserByUsername = async (username: string) => {
    const searchedUser = await userRepo.findUserByUsername(username);

    if (!searchedUser) throw new ApiError(404, "User not found");

    return searchedUser;
};

export const userService = {
    myProfile,
    searchUserByUsername,
};
