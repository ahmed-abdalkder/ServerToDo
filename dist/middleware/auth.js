"use strict";
// // This file defines an Express middleware function `auth` that authenticates users using a JWT token.
// // It checks for the token in the request headers, verifies it, finds the user in the database,
// // and attaches the authenticated user to the request object if valid.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
// import jwt, { JwtPayload } from "jsonwebtoken";
// // Importing jwt library for token verification and decoding.
// // JwtPayload type is used for safe access to decoded token properties.
// import { Request, Response, NextFunction } from "express";
// // Importing Express types to define types for request, response, and next middleware function.
// import userModel, { IUser } from "../db/models/usermodel";
// // Importing the user model and its interface to fetch user data from the database.
// // Extend the default Express Request type to include a possible `user` property
// interface AuthRequest extends Request {
//   user?: IUser; // This will hold the authenticated user after verifying the token
// }
// // Define the authentication middleware
// export const auth = () => {
//   return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
//     // Extract token from request headers (assuming it's sent in `headers.token`)
//     const token = req.headers.token as string;
//     // If token is missing, return 401 Unauthorized
//     if (!token) {
//       res.status(401).json(('token_not_found'));
//       return;
//     }
//     let decoded: JwtPayload;
//     try {
//       // Try to verify the token using the secret key from environment variables
//       decoded = jwt.verify(token, process.env.JWT_KEY as string) as JwtPayload;
//     } catch {
//       // If token is invalid or expired, return 401 Unauthorized
//       res.status(401).json(('invalid_token'));
//       return;
//     }
//     // If the decoded token does not include an `id`, reject the request
//     if (!decoded?.id) {
//       res.status(401).json(('token_not_found'));
//       return;
//     }
//     // Find the user in the database by ID from the decoded token
//     const user = await userModel.findById(decoded.id);
//     if (!user) {
//       // If user does not exist, return 401 Unauthorized
//       res.status(401).json(('user_not_found'));
//       return;
//     }
//     // Attach the authenticated user to the request for use in next middlewares or routes
//     req.user = user;
//     // Proceed to the next middleware or route handler
//     next();
//   };
// };
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const usermodel_1 = __importDefault(require("../db/models/usermodel"));
const auth = () => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const authReq = req;
        const token = req.headers.token;
        if (!token) {
            res.status(401).json({ message: "token_not_found" });
            return;
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_KEY);
            if (!(decoded === null || decoded === void 0 ? void 0 : decoded.id)) {
                res.status(401).json({ message: "token_invalid_or_missing_id" });
                return;
            }
            const user = yield usermodel_1.default.findById(decoded.id);
            if (!user) {
                res.status(401).json({ message: "user_not_found" });
                return;
            }
            authReq.user = user;
            next();
        }
        catch (error) {
            res.status(401).json({ message: "invalid_token" });
        }
    });
};
exports.auth = auth;
