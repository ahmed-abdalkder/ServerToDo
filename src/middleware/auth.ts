import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import userModel, { IUser } from "../db/models/usermodel";
 
 

interface AuthRequest extends Request {
  user?: IUser;
   
}

export const auth = () => {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    
    const token = req.headers.token as string;

    if (!token) {
      res.status(401).json( ('token_not_found'));
      return;
    }

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, process.env.JWT_KEY as string) as JwtPayload;
    } catch {
      res.status(401).json( ('invalid_token'));
      return;
    }

    if (!decoded?.id) {
      res.status(401).json( ('token_not_found'));
      return;
    }

    const user = await userModel.findById(decoded.id);
    if (!user) {
      res.status(401).json( ('user_not_found'));
      return;
    }

    req.user = user;

    next();
  };
};


