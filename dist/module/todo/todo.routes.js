"use strict";
// This file defines all API routes related to Todo operations.
// It includes routes for creating, reading, updating, and deleting todos and tasks.
// Each route is protected by authentication middleware and some use image upload middleware.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// Import Express to create a router instance
const todo_controler_1 = require("./todo.controler");
// Import controller functions that handle logic for each route
const auth_1 = require("../../middleware/auth");
// Import authentication middleware to protect routes
const multer_1 = require("../../service/multer");
// Import multer configuration for handling image uploads
const router = express_1.default.Router();
// Create a new router instance to define routes under /api/todo or similar
// Route: GET all todos for the authenticated user
router.get("/gettodos", (0, auth_1.auth)(), todo_controler_1.getTodos);
// Route: GET a specific todo by title
router.get("/gettodo/:title", (0, auth_1.auth)(), todo_controler_1.getTodo);
// Route: POST create a new todo with an uploaded image
router.post("/", (0, auth_1.auth)(), (0, multer_1.multerhost)().single("image"), todo_controler_1.createTodo);
// Route: POST add a new task to a specific todo
router.post("/:id/task", (0, auth_1.auth)(), todo_controler_1.addTask);
// Route: DELETE a todo by ID
router.delete("/:id/task", (0, auth_1.auth)(), todo_controler_1.deleteTodo); // ❗ Consider changing path to just `/:id` for clarity
// Route: PUT update a specific task in a todo
router.put("/:id/task/:taskId", (0, auth_1.auth)(), todo_controler_1.updateTask);
// Route: DELETE a specific task from a todo
router.delete("/:id/task/:taskId", (0, auth_1.auth)(), todo_controler_1.deleteTask);
// Route: GET all tasks from a specific todo
router.get("/:id/tasks", (0, auth_1.auth)(), todo_controler_1.getTasks);
exports.default = router;
// Export the router so it can be used in the main app (e.g., app.use('/api/todo', router))
