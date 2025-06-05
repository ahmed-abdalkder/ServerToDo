// This file defines all API routes related to Todo operations.
// It includes routes for creating, reading, updating, and deleting todos and tasks.
// Each route is protected by authentication middleware and some use image upload middleware.

import express from "express";
// Import Express to create a router instance

import {
  addTask,
  createTodo,
  deleteTask,
  deleteTodo,
  getTasks,
  getTodo,
  getTodos,
  updateTask,
} from "./todo.controler";
// Import controller functions that handle logic for each route

import { auth } from "../../middleware/auth";
// Import authentication middleware to protect routes

import { multerhost } from "../../service/multer";
// Import multer configuration for handling image uploads

const router = express.Router();
// Create a new router instance to define routes under /api/todo or similar

// Route: GET all todos for the authenticated user
router.get("/gettodos", auth(), getTodos);

// Route: GET a specific todo by title
router.get("/gettodo/:title", auth(), getTodo);

// Route: POST create a new todo with an uploaded image
router.post("/", auth(), multerhost().single("image"), createTodo);

// Route: POST add a new task to a specific todo
router.post("/:id/task", auth(), addTask);

// Route: DELETE a todo by ID
router.delete("/:id/task", auth(), deleteTodo); // ❗ Consider changing path to just `/:id` for clarity

// Route: PUT update a specific task in a todo
router.put("/:id/task/:taskId", auth(), updateTask);

// Route: DELETE a specific task from a todo
router.delete("/:id/task/:taskId", auth(), deleteTask);

// Route: GET all tasks from a specific todo
router.get("/:id/tasks", auth(), getTasks);

export default router;
// Export the router so it can be used in the main app (e.g., app.use('/api/todo', router))



