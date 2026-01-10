import { Types } from "mongoose";
import { User, Gender, UserDocument } from "./user.model.js";

type CreateUserInput = {
    username: string;
    name: string;
    gender: Gender;
    avatar?: string;
};

const createUser = async (
    input: CreateUserInput
): Promise<UserDocument> => {
    const user = await User.create(input);
    return user;
};

const findUserById = async(id: Types.ObjectId | string): Promise<UserDocument | null> => {
    return await User.findById(id);
};

const userExistsById = async(id: Types.ObjectId): Promise<boolean> => {
    const exists = await User.exists({_id: id});
    return Boolean(exists);
}

const findUsernameById = async(id: Types.ObjectId): Promise<string | null> => {
    const user = await User.findById(id).select("username").lean();
    return user ? user.username : null;
}

const findUserByUsername = async (username: string): Promise<UserDocument | null> => {
    const user = await User.findOne({ username });
    return user;
};

export const userRepo = {
    createUser,
    findUserById,
    userExistsById,
    findUsernameById,
    findUserByUsername
}