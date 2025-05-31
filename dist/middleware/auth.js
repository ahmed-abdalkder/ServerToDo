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
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const usermodel_1 = __importDefault(require("../db/models/usermodel"));
const auth = () => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const token = req.headers.token;
        if (!token) {
            res.status(401).json(('token_not_found'));
            return;
        }
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_KEY);
        }
        catch (_a) {
            res.status(401).json(('invalid_token'));
            return;
        }
        if (!(decoded === null || decoded === void 0 ? void 0 : decoded.id)) {
            res.status(401).json(('token_not_found'));
            return;
        }
        const user = yield usermodel_1.default.findById(decoded.id);
        if (!user) {
            res.status(401).json(('user_not_found'));
            return;
        }
        req.user = user;
        next();
    });
};
exports.auth = auth;
