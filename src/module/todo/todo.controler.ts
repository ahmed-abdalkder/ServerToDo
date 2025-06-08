// This controller handles CRUD operations for a To-Do list application.
// It supports creating todos (with image upload), fetching, updating, deleting todos,
// and managing tasks within each todo. Each operation is user-specific.

import { Request, Response } from "express";
// Importing Express types to type-check request and response objects.

import cloudinary from "../../service/cloudinary";
// Importing the configured Cloudinary instance for image upload.

import todoModel from "../../db/models/todomodel";
// Importing the Mongoose model for the Todo document.


// Custom request interface to include authenticated user, file, and optional filepath
interface CustomRequest extends Request {
  user?: {
    _id: string;
  };
  file?: Express.Multer.File;
  filepath?: string;
}

// GET all todos for the authenticated user
export const getTodos = async (req: CustomRequest, res: Response): Promise<void> => {
  const todos = await todoModel.find({ user: req.user?._id });
  res.json(todos);
};

// GET a single todo by its title
export const getTodo = async (req: CustomRequest, res: Response): Promise<void> => {
  const { title } = req.params;
  const todo = await todoModel.findOne({title });
  res.json(todo);
};

// CREATE a new todo with image upload
export const createTodo = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const { title } = req.body;

    // Ensure an image file is uploaded
    if (!req.file) {
      res.status(401).json({ message: "please add image" });
      return;
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: `Todo-list/task`,
    });

    // Store image path in request if needed
    req.filepath = `Todo-list/task`;

    // Create the new todo document
    const todo = await todoModel.create({
      user: req.user?._id,
      title,
      image: {
        secure_url: result.secure_url,
        public_id: result.public_id,
      },
      tasks: [],
    });

    res.status(201).json(todo);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Something went wrong' });
    }
  }
};

// ADD a new task to a specific todo
export const addTask = async (req: CustomRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { text, date } = req.body;

  // Find the todo by ID and user
  const todo = await todoModel.findOne({ _id: id, user: req.user?._id });

  if (!todo) {
    res.status(404).json({ message: "Todo not found" });
    return;
  }

  // Add the new task
  todo.tasks.push({ text, date: new Date(date) });
  await todo.save();
  res.json(todo);
};

// DELETE a todo by ID
export const deleteTodo = async (req: CustomRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  // Delete the todo if it exists and belongs to the user
  const todo = await todoModel.findOneAndDelete({ _id: id, user: req.user?._id });

  if (!todo) {
    res.status(404).json({ message: "To-Do not found" });
    return;
  }

  res.json({ message: "To-Do deleted successfully", todo });
};

// UPDATE a specific task within a todo
export const updateTask = async (req: CustomRequest, res: Response): Promise<void> => {
  const { id, taskId } = req.params;
  const { text, completed } = req.body;

  // Find the parent todo
  const todo = await todoModel.findOne({ _id: id, user: req.user?._id });

  if (!todo) {
    res.status(404).json({ message: "Todo not found" });
    return;
  }

  // Find the specific task to update
  const task = todo.tasks.find(t => t.id === taskId);

  if (!task) {
    res.status(404).json({ message: "Task not found" });
    return;
  }

  // Apply updates if provided
  if (text !== undefined) task.text = text;
  if (completed !== undefined) task.completed = completed;

  await todo.save();
  res.status(200).json(todo);
};

// DELETE a specific task from a todo
export const deleteTask = async (req: CustomRequest, res: Response): Promise<void> => {
  const { id, taskId } = req.params;

  // Find the parent todo
  const todo = await todoModel.findOne({ _id: id, user: req.user?._id });

  if (!todo) {
    res.status(404).json({ message: "Todo not found" });
    return;
  }

  // Remove the task
  todo.tasks = todo.tasks.filter(t => t.id !== taskId);
  await todo.save();

  res.status(200).json(todo);
};

// GET all tasks from a specific todo
export const getTasks = async (req: CustomRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  // Find the todo and return its tasks
  const todo = await todoModel.findOne({ _id: id, user: req.user?._id });

  if (!todo) {
    res.status(404).json({ message: "Todo not found" });
    return;
  }

  res.status(200).json(todo.tasks);
};
