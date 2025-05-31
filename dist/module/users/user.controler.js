"use strict";
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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const usermodel_1 = __importDefault(require("../../db/models/usermodel"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, name } = req.body;
    const exists = yield usermodel_1.default.findOne({ email });
    if (exists) {
        res.status(400).json({ msg: "Account already exists" });
        return;
    }
    const hashed = yield bcryptjs_1.default.hash(password, 10);
    const user = yield usermodel_1.default.create({ email, password: hashed, name });
    res.status(201).json({ user });
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
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
    res.json({ msg: "token", token, user });
});
exports.login = login;
