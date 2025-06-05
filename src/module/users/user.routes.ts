// This component defines the authentication routes for user registration and login.
// It connects HTTP POST requests to the corresponding controller functions.

import express, { Router } from "express";
// Import express and the Router type to create modular route handlers

import { login, register } from "./user.controler";
// Import the authentication controller functions for login and register

const router: Router = express.Router();
// Create a new router instance to define route endpoints

// Route for user registration - calls the register controller
router.post("/register", register);

// Route for user login - calls the login controller
router.post("/login", login);

export default router;
// Export the router to be used in the main app or server file


