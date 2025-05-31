"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerhost = void 0;
//import { nanoid } from "nanoid";
const multer_1 = __importDefault(require("multer"));
//import { Request } from "express";
// export const datahost: Record<string, string[]> = {
//   image: ["image/JFIF", "image/jpeg", "image/jpg", "image/webp"],
//   pdf: ["application/pdf"],
//   video: ["video/mp4"],
// };
const multerhost = () => {
    const storage = multer_1.default.diskStorage({});
    const upload = (0, multer_1.default)({ storage });
    return upload;
};
exports.multerhost = multerhost;
// export const localmulter = (): multer.Multer => {
//   const storage: StorageEngine = multer.diskStorage({
//     destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
//       cb(null, 'uploads');
//     },
//     filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
//       cb(null, nanoid(5) + file.originalname);
//     },
//   });
//   const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
//     if (customvalidation.includes(file.mimetype)) {
//       cb(null, true);
//     } else {
//       cb(new Error('File type not supported'));
//     }
//   };
//   const upload = multer({ storage /*, fileFilter*/ });
//   return upload;
// };
