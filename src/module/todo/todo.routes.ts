import express from "express";
 
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
import { auth } from "../../middleware/auth";
import {  multerhost } from "../../service/multer";
 
 

const router = express.Router();

// const upload = multer({ dest: "uploads/" });

router.get("/gettodos", auth(), getTodos);
router.get("/gettodo/:title", auth(), getTodo);
router.post("/", auth(), multerhost().single("image"), createTodo);
router.post("/:id/task", auth(), addTask);
router.delete("/:id/task", auth(), deleteTodo);
router.put("/:id/task/:taskId", auth(), updateTask);
router.delete("/:id/task/:taskId", auth(), deleteTask);
router.get("/:id/tasks", auth(), getTasks);

export default router;


