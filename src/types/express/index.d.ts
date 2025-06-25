
import { IUser } from "../../db/models/usermodel";

declare global {
  namespace Express {
    interface User extends IUser {}
    interface Request {
      user?: IUser;
    }
  }
}
