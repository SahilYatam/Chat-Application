import { Schema, model, Types } from "mongoose";

interface AuthSchemaType {
    userId: Types.ObjectId;
    email?: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

const authSchema = new Schema<AuthSchemaType>({
    email: {
        type: String,
        unique: true,
        sparse: true
    },

    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    }

}, { timestamps: true });

export const Auth = model<AuthSchemaType>("Auth", authSchema);
