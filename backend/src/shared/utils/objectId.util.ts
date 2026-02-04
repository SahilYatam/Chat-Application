import { Types } from "mongoose";

export const normalizeObjectId = (id: string | Types.ObjectId): Types.ObjectId => {
    return typeof id === "string" ? new Types.ObjectId(id) : id;
};

// ======= ZOD ======= 

import { z } from "zod";

export const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId")
  .transform((val) => new Types.ObjectId(val));