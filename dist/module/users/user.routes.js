"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controler_1 = require("./user.controler");
const router = express_1.default.Router();
router.post("/register", user_controler_1.register);
router.post("/login", user_controler_1.login);
exports.default = router;
