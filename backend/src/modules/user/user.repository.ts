import { Types } from "mongoose";
import { User, Gender, UserDocument, UserSchemaType } from "./user.model.js";
import { SidePanelUser } from "./user.types.js";

export type UserLean = UserSchemaType & {
    _id: Types.ObjectId;
};

type CreateUserInput = {
    username: string;
    name: string;
    gender: Gender;
    avatar?: string;
};

const createUser = async (input: CreateUserInput): Promise<UserDocument> => {
    return User.create(input);
};

const findUserById = async (id: string | Types.ObjectId): Promise<UserLean | null> => {
    return User.findById(id).lean<UserLean>().exec();
};

const findUsersByIds = (ids: Types.ObjectId[]): Promise<UserLean[]> => {
    return User.find({
        _id: { $in: ids },
    })
        .select("username avatar")
        .lean<UserLean[]>()
        .exec();
};

const userExistsById = async (
    id: Types.ObjectId | string,
): Promise<boolean> => {
    const exists = await User.exists({ _id: id });
    return Boolean(exists);
};

type UsernameProjection = Pick<UserLean, "_id" | "username">;

const findUsernameById = async (
    id: Types.ObjectId | string,
): Promise<string | null> => {
    const user = await User.findById(id)
        .select("username")
        .lean<UsernameProjection>()
        .exec();

    return user?.username ?? null;
};

const findUserByUsername = async (
    username: string,
): Promise<UserLean | null> => {
    return User.findOne({ username }).lean<UserLean>().exec();
};

const searchUsersByUsername = async (username: string): Promise<UserLean[]> => {
    return await User.find({
        username: { $regex: username, $options: "i" },
    })
        .select({ username: 1, avatar: 1 })
        .limit(20)
        .lean<UserLean[]>();
};

const getAllUserForSidePanel = async (): Promise<SidePanelUser[]> => {
    return User.find({})
        .select({ username: 1, avatar: 1 })
        .lean<SidePanelUser[]>();
};

export const userRepo = {
    createUser,
    findUserById,
    findUsersByIds,
    userExistsById,
    findUsernameById,
    findUserByUsername,
    searchUsersByUsername,
    getAllUserForSidePanel,
};
