import { UserDocument } from "../../modules/user/user.model.ts";

declare global {
    namespace Express {
        interface Request {
            user: UserDocument;
        }
    }
}