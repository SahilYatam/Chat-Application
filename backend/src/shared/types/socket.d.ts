import { UserDocument } from "../../modules/user/user.model.ts";

declare module "socket.io" {
  interface Socket {
    data: {
      user: UserDocument;
    };
  }
}
