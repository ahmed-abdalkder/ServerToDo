"use strict";
// This file handles the database connection logic for MongoDB using Mongoose.
// It exports a reusable async function `connectDB` that connects to the database
// using the connection string stored in the environment variable `DB_ONLINE`.
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
const mongoose_1 = __importDefault(require("mongoose"));
// Import the Mongoose library, which is used to connect and interact with MongoDB databases.
// Define an asynchronous function to connect to MongoDB
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Attempt to connect to MongoDB using the connection string from the environment variable
        yield mongoose_1.default.connect(process.env.DB_ONLINE);
        // If successful, log a confirmation message
        console.log("MongoDB Connected");
    }
    catch (error) {
        // If an error occurs, catch it and log a meaningful error message
        console.error("DB Connection Failed:", error instanceof Error ? error.message : error);
    }
});
// Export the connection function to be used in other parts of the app (e.g., server.ts)
exports.default = connectDB;
