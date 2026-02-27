import { UserLean } from "../../modules/user/user.repository.ts";

declare global {
    namespace Express {
        interface Request {
            user: UserLean;
        }
    }
}