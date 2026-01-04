import { Schema, model, Types, Document } from "mongoose";

export interface SessionSchemaType {
    userId: Types.ObjectId;
    refreshToken: string;
    refreshTokenExpiresAt: Date;
    isActive: boolean,
    lastActivity: Date,
    createdAt: Date;
    updatedAt: Date;
}

export type SessionDocument = SessionSchemaType & Document;

const sessionSchema = new Schema<SessionSchemaType>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "Auth",
        required: true
    },

    refreshToken: {
        type: String,
        unique: true,
        required: true
    },

    refreshTokenExpiresAt: {
        type: Date,
        required: true
    },

    isActive: {
        type: Boolean,
        default: false,
    },

    lastActivity: {
        type: Date,
        default: Date.now()
    }

}, {timestamps: true});

sessionSchema.index({refreshToken: 1}, {unique: true});

export const Session = model<SessionSchemaType>("Session", sessionSchema);