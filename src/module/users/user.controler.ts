// This component handles user authentication logic including registration and login.
// It uses bcrypt for password hashing and jwt for token generation.
// This module is used in authentication routes such as /register and /login.

import bcrypt from "bcryptjs";
// For hashing passwords securely

import jwt from "jsonwebtoken";
// For generating JWT tokens for authenticated users

import { Request, Response } from "express";
// To type the request and response objects

import userModel from "../../db/models/usermodel";
// Mongoose user model for database interaction

// Define a custom request type for authentication, requiring email and password
interface AuthRequest extends Request {
  body: {
    email: string;
    password: string;
    name?: string; // optional, used only for registration
  };
}

// Register a new user
export const register = async (req: AuthRequest, res: Response): Promise<void> => {
  const { email, password, name } = req.body;

  // Check if a user already exists with the given email
  const exists = await userModel.findOne({ email });
  if (exists) {
    res.status(400).json({ msg: "Account already exists" });
    return;
  }

  // Hash the password securely
  const hashed = await bcrypt.hash(password, 10);

  // Create a new user document in the database
  const user = await userModel.create({ email, password: hashed, name });

  // Respond with the created user object (excluding sensitive info like password)
  res.status(201).json({ user });
};

// Login an existing user
export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  const { email, password } = req.body;

  // Find user by email
  const user = await userModel.findOne({ email });
  if (!user) {
    res.status(401).json({ msg: "Invalid Email or Password" });
    return;
  }

  // Compare provided password with hashed password in the database
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401).json({ msg: "Invalid Email or Password" });
    return;
  }

  // Generate JWT token with user ID payload
  const jwtKey = process.env.JWT_KEY as string;
  const token = jwt.sign({ id: user._id }, jwtKey);

  // Respond with token and user (excluding password)
  res.json({ msg: "Login successful", token, user });
};


 