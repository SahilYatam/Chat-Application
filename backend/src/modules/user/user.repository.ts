import { Types } from "mongoose";
import { User, Gender, UserDocument, UserSchemaType } from "./user.model.js";

type UserLean = UserSchemaType & {
    _id: Types.ObjectId;
};

type CreateUserInput = {
    username: string;
    name: string;
    gender: Gender;
    avatar?: string;
};

const createUser = async (input: CreateUserInput): Promise<UserDocument> => {
    const user = await User.create(input);
    return user;
};

const findUserById = async (
    id: Types.ObjectId | string
): Promise<UserLean | null> => {
    return await User.findById(id).lean<UserLean>();
};

const userExistsById = async (id: Types.ObjectId): Promise<boolean> => {
    const exists = await User.exists({ _id: id });
    return Boolean(exists);
};

type UsernameProjection = Pick<UserLean, "_id" | "username">;

const findUsernameById = async (id: Types.ObjectId): Promise<string | null> => {
    const user = await User.findById(id)
        .select("username")
        .lean<UsernameProjection>();

    return user?.username ?? null;
};

const findUserByUsername = async (
    username: string
): Promise<UserLean | null> => {
    const user = await User
        .findOne({ username })
        .lean<UserLean>();
    return user;
};

export const userRepo = {
    createUser,
    findUserById,
    userExistsById,
    findUsernameById,
    findUserByUsername,
};
