import { Types } from "mongoose";

export interface UserData {
    id: Types.ObjectId;
    username: string;
    name: string;
}
