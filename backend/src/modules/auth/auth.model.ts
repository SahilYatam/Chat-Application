import { Schema, model, Types, HydratedDocument } from "mongoose";

export interface AuthSchemaType {
    userId: Types.ObjectId;
    email?: string;
    password: string;
    resetPasswordToken?: string;
    resetPasswordTokenExpiresAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export type AuthDocument = HydratedDocument<AuthSchemaType>;

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
    },

    resetPasswordToken: {
        type: String,
    },

    resetPasswordTokenExpiresAt: {
        type: Date,
    }

}, { timestamps: true });

authSchema.index({userId: 1, email: 1}, {unique: true});

export const Auth = model<AuthSchemaType>("Auth", authSchema);
