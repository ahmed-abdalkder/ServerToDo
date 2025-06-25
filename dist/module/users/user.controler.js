"use strict";
// // This component handles user authentication logic including registration and login.
// // It uses bcrypt for password hashing and jwt for token generation.
// // This module is used in authentication routes such as /register and /login.
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
exports.login = exports.register = void 0;
// import bcrypt from "bcryptjs";
// // For hashing passwords securely
// import jwt from "jsonwebtoken";
// // For generating JWT tokens for authenticated users
// import { Request, Response } from "express";
// // To type the request and response objects
// import userModel from "../../db/models/usermodel";
// // Mongoose user model for database interaction
// // Define a custom request type for authentication, requiring email and password
// interface AuthRequest extends Request {
//   body: {
//     email: string;
//     password: string;
//     name?: string; // optional, used only for registration
//   };
// }
// export interface CustomRequest extends Request {
//   user?: {
//     _id: string;  
//   };
// }
// // Register a new user
// export const register = async (req: AuthRequest, res: Response): Promise<void> => {
//   const { email, password, name } = req.body;
//   // Check if a user already exists with the given email
//   const exists = await userModel.findOne({ email });
//   if (exists) {
//     res.status(400).json({ msg: "Account already exists" });
//     return;
//   }
//   // Hash the password securely
//   const hashed = await bcrypt.hash(password, 10);
//   // Create a new user document in the database
//   const user = await userModel.create({ email, password: hashed, name });
//   // Respond with the created user object (excluding sensitive info like password)
//   res.status(201).json({ user });
// };
// // Login an existing user
// export const login = async (req: AuthRequest, res: Response): Promise<void> => {
//   const { email, password } = req.body;
//   // Find user by email
//   const user = await userModel.findOne({ email });
//   if (!user) {
//     res.status(401).json({ msg: "Invalid Email or Password" });
//     return;
//   }
//   // Compare provided password with hashed password in the database
//   const isMatch = await bcrypt.compare(password, user.password);
//   if (!isMatch) {
//     res.status(401).json({ msg: "Invalid Email or Password" });
//     return;
//   }
//   // Generate JWT token with user ID payload
//   const jwtKey = process.env.JWT_KEY as string;
//   const token = jwt.sign({ id: user._id }, jwtKey);
//   // Respond with token and user (excluding password)
//   res.json({ msg: "Login successful", token, user });
// };
// This component handles user authentication logic including registration and login.
// It uses bcrypt for password hashing and jwt for token generation.
// This module is used in authentication routes such as /register and /login.
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const usermodel_1 = __importDefault(require("../../db/models/usermodel"));
// Register a new user
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, name } = req.body;
    try {
        const exists = yield usermodel_1.default.findOne({ email });
        if (exists) {
            res.status(400).json({ msg: "Account already exists" });
            return;
        }
        const hashed = yield bcryptjs_1.default.hash(password, 10);
        const user = yield usermodel_1.default.create({ email, password: hashed, name });
        res.status(201).json({ user });
    }
    catch (error) {
        res.status(500).json({ error: "Registration failed" });
    }
});
exports.register = register;
// Login an existing user
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield usermodel_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ msg: "Invalid Email or Password" });
            return;
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ msg: "Invalid Email or Password" });
            return;
        }
        const jwtKey = process.env.JWT_KEY;
        const token = jsonwebtoken_1.default.sign({ id: user._id }, jwtKey);
        res.json({ msg: "Login successful", token, user });
    }
    catch (error) {
        res.status(500).json({ error: "Login failed" });
    }
});
exports.login = login;
