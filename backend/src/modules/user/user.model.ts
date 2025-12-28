import { Schema, model, Types } from "mongoose";

interface UserSchemaType {
    username: string;
    name: string;
    avatar: string,
    friends: Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<UserSchemaType>({
    username: {
        type: String,
        required: true,
        unique: true
    },

    name: {
        type: String,
        required: true
    },

    avatar: {
        type: String,
    },

    friends: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
    ]

}, {timestamps: true});

export const User = model<UserSchemaType>("User", userSchema)
