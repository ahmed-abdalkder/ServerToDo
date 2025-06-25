"use strict";
// This component defines the authentication routes for user registration and login.
// It connects HTTP POST requests to the corresponding controller functions.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// Import express and the Router type to create modular route handlers
const user_controler_1 = require("./user.controler");
// Import the authentication controller functions for login and register
const router = express_1.default.Router();
// Create a new router instance to define route endpoints
// Route for user registration - calls the register controller
router.post("/register", user_controler_1.register);
// Route for user login - calls the login controller
router.post("/login", user_controler_1.login);
exports.default = router;
// Export the router to be used in the main app or server file
