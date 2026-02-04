import { Types } from "mongoose";

export type MarkAsReadInput = {
    notificationId: Types.ObjectId;
    receiverId: Types.ObjectId;
};

export type MarkAsReadOutput = {
    read: boolean;
    count: number;
};

export type MarkAsDeliverdOutput = {
    delivered: boolean;
    count: number;
};
