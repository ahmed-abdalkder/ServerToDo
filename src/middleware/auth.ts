// This file defines an Express middleware function `auth` that authenticates users using a JWT token.
// It checks for the token in the request headers, verifies it, finds the user in the database,
// and attaches the authenticated user to the request object if valid.

import jwt, { JwtPayload } from "jsonwebtoken";
// Importing jwt library for token verification and decoding.
// JwtPayload type is used for safe access to decoded token properties.

import { Request, Response, NextFunction } from "express";
// Importing Express types to define types for request, response, and next middleware function.

import userModel, { IUser } from "../db/models/usermodel";
// Importing the user model and its interface to fetch user data from the database.

// Extend the default Express Request type to include a possible `user` property
interface AuthRequest extends Request {
  user?: IUser; // This will hold the authenticated user after verifying the token
}

// Define the authentication middleware
export const auth = () => {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    
    // Extract token from request headers (assuming it's sent in `headers.token`)
    const token = req.headers.token as string;
       console.log(token);

    // If token is missing, return 401 Unauthorized
    if (!token) {
      res.status(401).json(('token_not_found'));
      return;
    }

    let decoded: JwtPayload;

    try {
      // Try to verify the token using the secret key from environment variables
      decoded = jwt.verify(token, process.env.JWT_KEY as string) as JwtPayload;
    } catch {
      // If token is invalid or expired, return 401 Unauthorized
      res.status(401).json(('invalid_token'));
      return;
    }

    // If the decoded token does not include an `id`, reject the request
    if (!decoded?.id) {
      res.status(401).json(('token_not_found'));
      return;
    }

    // Find the user in the database by ID from the decoded token
    const user = await userModel.findById(decoded.id);
    if (!user) {
      // If user does not exist, return 401 Unauthorized
      res.status(401).json(('user_not_found'));
      return;
    }

    // Attach the authenticated user to the request for use in next middlewares or routes
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  };
};


// import jwt, { JwtPayload } from "jsonwebtoken";
// import { Request, Response, NextFunction } from "express";
// import userModel, { IUser } from "../db/models/usermodel";

// interface AuthRequest extends Request {
//   user?: IUser;
// }

// export const auth = () => {
//   return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
//     // تسجيل محتوى الهيدرز لفحص شكل التوكن القادم
//     console.log("Request Headers:", req.headers);

//     // محاولة استخراج التوكن من الهيدرز المختلفة
//     const rawToken = req.headers.authorization || req.headers.token;

//     let token: string | undefined;

//     if (Array.isArray(rawToken)) {
//       token = rawToken[0]; // إذا كان مصفوفة خذ أول عنصر
//     } else if (typeof rawToken === "string") {
//       token = rawToken.startsWith("Bearer ") ? rawToken.split(" ")[1] : rawToken;
//     }

//     if (!token) {
//       res.status(401).json({ error: "token_not_found" });
//       return;
//     }

//     let decoded: JwtPayload;

//     try {
//       decoded = jwt.verify(token, process.env.JWT_KEY as string) as JwtPayload;
//     } catch {
//       res.status(401).json({ error: "invalid_token" });
//       return;
//     }


//     if (!decoded?.id) {
//       res.status(401).json({ error: "invalid_token_payload" });
//       return;
//     }

//     const user = await userModel.findById(decoded.id);
//     if (!user) {
//       res.status(401).json({ error: "user_not_found" });
//       return;
//     }

//     req.user = user;

//     next();
//   };
// };
