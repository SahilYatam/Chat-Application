import { Types } from "mongoose";
import { Auth, AuthSchemaType, AuthDocument } from "./auth.model.js";
import {
  Session,
  SessionDocument,
  SessionSchemaType,
} from "./session.model.js";

// =============== AUTH REPO FUNCTIONS ===============
type AuthLean = AuthSchemaType & {
  _id: Types.ObjectId;
};

type CreateAuthInput = {
  userId: Types.ObjectId;
  password: string;
  email?: string;
};

const createAuth = async (input: CreateAuthInput): Promise<AuthDocument> => {
  return await Auth.create(input);
};

type AuthUpdate = Partial<{
  password: string;
  resetPasswordToken: string | null;
  resetPasswordTokenExpiresAt: Date | null;
}>;

type UpdateAuthInput = {
  id: Types.ObjectId;
  updates: AuthUpdate;
};

const updateAuthById = async (
  input: UpdateAuthInput,
): Promise<AuthDocument | null> => {
  const updatedAuth = await Auth.findByIdAndUpdate(
    input.id,
    { $set: input.updates },
    { new: true },
  );
  return updatedAuth;
};

const findAuthById = async (
    authId: string | Types.ObjectId
): Promise<AuthLean | null> => {
    return Auth.findById(authId).lean<AuthLean>();
};


const findByUserId = async (
  userId: string | Types.ObjectId,
): Promise<AuthLean | null> => {
  return Auth.findOne({ userId }).lean<AuthLean>();
};

const findUserByEmail = async (email: string): Promise<AuthLean | null> => {
  return await Auth.findOne({ email }).lean<AuthLean>();
};

const findHashedResetPasswordToken = async (
  hashedToken: string,
): Promise<AuthLean | null> => {
  return await Auth.findOne({
    resetPasswordToken: hashedToken,
  }).lean<AuthLean>();
};

export const authRepo = {
  createAuth,
  updateAuthById,
  findHashedResetPasswordToken,
  findByUserId,
  findAuthById,
  findUserByEmail,
};

// =============== SESSION REPO FUNCTIONS ===============

type SessionLean = SessionSchemaType & {
  _id: Types.ObjectId;
};

type CreateSessionInput = {
  userId: Types.ObjectId;
  refreshToken: string;
  refreshTokenExpiresAt: Date;
  isActive: boolean;
  lastActivity: Date;
};

const createSession = async (
  input: CreateSessionInput,
): Promise<SessionDocument> => {
  const session = await Session.create(input);
  return session;
};

type UpdateSessionInput = {
  id: Types.ObjectId;
  updates: Partial<SessionSchemaType>;
};

const updateSessionById = async (
  input: UpdateSessionInput,
): Promise<SessionDocument | null> => {
  const updatedSession = await Session.findByIdAndUpdate(
    input.id,
    { $set: input.updates },
    { new: true },
  );
  return updatedSession;
};

const deleteSessionByHashedToken = async (
  hashedToken: string,
): Promise<SessionDocument | null> => {
  return await Session.findOneAndDelete({ refreshToken: hashedToken });
};

const deleteExpiredSessions = async () => {
  let batchSize = 100;
  let totalDeleted = 0;

  while (true) {
    const expired = await Session.find(
      { refreshTokenExpiresAt: { $lt: new Date() } },
      { _id: 1 },
    )
      .limit(batchSize)
      .lean<Pick<SessionLean, "_id">[]>();

    if (expired.length === 0) break;

    const ids = expired.map((s) => s._id);

    const { deletedCount } = await Session.deleteMany({ _id: { $in: ids } });

    totalDeleted += deletedCount;

    await new Promise((res) => setTimeout(res, 100));
  }
  return totalDeleted;
};

const findSession = async (
  refreshToken: string,
): Promise<SessionLean | null> => {
  return await Session.findOne({ refreshToken }).lean<SessionLean>();
};

export const sessionRepo = {
  createSession,
  updateSessionById,
  findSession,
  deleteExpiredSessions,
  deleteSessionByHashedToken,
};
