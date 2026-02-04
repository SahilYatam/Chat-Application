import { Types } from "mongoose";

export interface UserData {
    id: Types.ObjectId;
    username: string;
    name: string;
}

export type SidePanelUser = {
    _id: Types.ObjectId;
    username: string;
    avatar?: string;
};
