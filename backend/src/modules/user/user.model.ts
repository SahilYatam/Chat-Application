import { Schema, model, Types, HydratedDocument } from "mongoose";

export enum Gender {
  MALE = "male",
  FEMALE = "female",
}

export interface UserSchemaType {
    username: string;
    name: string;
    gender: Gender;
    avatar: string,
    createdAt: Date;
    updatedAt: Date;
}

export type UserDocument =
  HydratedDocument<UserSchemaType>;

const userSchema = new Schema<UserSchemaType>({
    username: {
        type: String,
        required: true,
        trim: true
    },

    name: {
        type: String,
        required: true
    },

    gender: {
        type: String,
        enum: Object.values(Gender),
        required: true
    },

    avatar: {
        type: String,
    },

}, {timestamps: true});

userSchema.index({username: 1}, {unique: true});

export const User = model<UserSchemaType>("User", userSchema)
