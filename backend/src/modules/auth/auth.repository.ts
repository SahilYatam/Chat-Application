import { Types } from "mongoose";
import { Auth, AuthDocument } from "./auth.model.js";
import { Session, SessionDocument } from "./session.model.js";


// =============== AUTH REPO FUNCTIONS ===============

type CreateAuthInput = {
    userId: Types.ObjectId;
    password: string;
    email?: string;
};

const createAuth = async (input: CreateAuthInput): Promise<AuthDocument> => {
    const authUser = await Auth.create(input);
    return authUser;
};

type AuthUpdate = Partial<{
    password: string;
    resetPasswordToken: string | null;
    resetPasswordTokenExpiresAt: Date | null;
}>;

type UpdateAuthInput = {
    id: Types.ObjectId, 
    updates: AuthUpdate
}

const updateAuthById = async(
    input: UpdateAuthInput
): Promise<AuthDocument | null> => {
    const updatedAuth = await Auth.findByIdAndUpdate(
        input.id, 
        {$set: input.updates},
        {new: true}
    );
    return updatedAuth;
}

const findUserById = async (
    id: string | Types.ObjectId
): Promise<AuthDocument | null> => {
    const authUser = await Auth.findById(id);
    return authUser;
};

const findUserByEmail = async (email: string): Promise<AuthDocument | null> => {
    const authUser = await Auth.findOne({ email });
    return authUser;
};

const findHashedResetPasswordToken = async(hashedToken: string): Promise<AuthDocument | null> => {
    return await Auth.findOne({resetPasswordToken: hashedToken})
}

export const authRepo = {
    createAuth,
    updateAuthById,
    findHashedResetPasswordToken,
    findUserById,
    findUserByEmail,
};


// =============== SESSION REPO FUNCTIONS ===============


type CreateSessionInput = {
    userId: Types.ObjectId;
    refreshToken: string;
    expiresAt: Date;
    isActive: boolean,
    lastActivity: Date,
};

const createSession = async (
    input: CreateSessionInput
): Promise<SessionDocument | null> => {
    const session = await Session.create(input);
    return session;
};

type UpdateSessionInput = {
    id: Types.ObjectId;
    updates: Partial<SessionDocument>;
};

const updateSessionById = async (
    input: UpdateSessionInput
): Promise<SessionDocument | null> => {
    const updatedSession = await Session.findByIdAndUpdate(input.id,
        { $set: input.updates },
        { new: true }
    );
    return updatedSession;
};

const deleteSessionByHashedToken = async (hashedToken: string) => {
    return await Session.findOneAndDelete({refreshToken: hashedToken})
}

const deleteExpiredSessions = async () => {
    let batchSize = 100;
    let totalDeleted = 0;

    while(true){
        const expired = await Session.find(
            {refreshTokenExpiresAt: {$lt: new Date()}},
            {_id: 1}
        ).limit(batchSize).lean();

        if(expired.length === 0) break;

        const ids = expired.map(s => s._id);

        const {deletedCount} = await Session.deleteMany({_id: {$in: ids}});

        totalDeleted += deletedCount;

        await new Promise(res => setTimeout(res, 100));
    }
    return totalDeleted;
}

const findSession = async(refreshToken: string): Promise<SessionDocument | null> => {
    return await Session.findOne({refreshToken})
}

export const sessionRepo = {
    createSession,
    updateSessionById,
    findSession,
    deleteExpiredSessions,
    deleteSessionByHashedToken,
}
