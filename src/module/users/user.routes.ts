import express, { Router } from "express";
import { login, register } from "./user.controler";

const router: Router = express.Router();

router.post("/register", register);

router.post("/login", login);

export default router;

