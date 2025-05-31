import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import userModel from "../../db/models/usermodel";
 

interface AuthRequest extends Request {
  body: {
    email: string;
    password: string;
    name?: string;
  };
}

export const register = async (req: AuthRequest, res: Response): Promise<void> => {
  const { email, password, name } = req.body;

  const exists = await userModel.findOne({ email });
  if (exists) {
    res.status(400).json({ msg: "Account already exists" });
    return;
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await userModel.create({ email, password: hashed, name });

  res.status(201).json({ user });
};

export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) {
    res.status(401).json({ msg: "Invalid Email or Password" });
    return;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401).json({ msg: "Invalid Email or Password" });
    return;
  }
const jwtKey = process.env.JWT_KEY as string;
  const token = jwt.sign({ id: user._id }, jwtKey);

  res.json({ msg: "token", token, user });
};


 