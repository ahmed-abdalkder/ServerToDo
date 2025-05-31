import { Request, Response } from "express";
import cloudinary from "../../service/cloudinary";
import todoModel from "../../db/models/todomodel";
 
 

  

interface CustomRequest  extends Request {
  user?: {
    _id: string;
    
  };
  file?: Express.Multer.File; 
    filepath?: string;
}

// GET all todos for the user
export const getTodos = async (req: CustomRequest , res: Response): Promise<void> => {
  const todos = await todoModel.find({ user: req.user?._id });
  res.json(todos);
};

// GET a todo by title
export const getTodo = async (req: CustomRequest , res: Response): Promise<void> => {
  const { title } = req.params;
  const todo = await todoModel.findOne({ title });
  res.json(todo);
};

// CREATE a todo
export const createTodo = async (req: CustomRequest , res: Response): Promise<void> => {
  try{
   
  const { title } = req.body;

   if(!req.file){
    res.status(401).json({ message: "please add image" });

     return;
  }
   
 
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: `Todo-list/task`,});
       req.filepath=`Todo-list/task ` 
//   const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  const todo = await todoModel.create({ user: req.user?._id, title,image: {
    secure_url: result.secure_url,
    public_id: result.public_id,
  }, tasks: [] });
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

// ADD a task to a todo
export const addTask = async (req: CustomRequest , res: Response): Promise<void> => {
  const { id } = req.params;
  const { text, date } = req.body;

  const todo = await todoModel.findOne({ _id: id, user: req.user?._id });
  if (!todo) {
    res.status(404).json({ message: "Todo not found" });
    return;
  }

  todo.tasks.push({ text, date: new Date(date) });
  await todo.save();
  res.json(todo);
};

// DELETE a todo
export const deleteTodo = async (req: CustomRequest , res: Response): Promise<void> => {
  const { id } = req.params;
  const todo = await todoModel.findOneAndDelete({ _id: id, user: req.user?._id });

  if (!todo) {
    res.status(404).json({ message: "To-Do not found" });
    return;
  }

  res.json({ message: "To-Do deleted successfully", todo });
};

// UPDATE a task in a todo
export const updateTask = async (req: CustomRequest , res: Response): Promise<void> => {
  const { id, taskId } = req.params;
  const { text, completed } = req.body;

  const todo = await todoModel.findOne({ _id: id, user: req.user?._id });
  if (!todo) {
    res.status(404).json({ message: "Todo not found" });
    return;
  }

  const task = todo.tasks.find(t => t.id === taskId);
  if (!task) {
    res.status(404).json({ message: "Task not found" });
    return;
  }

  if (text !== undefined) task.text = text;
  if (completed !== undefined) task.completed = completed;

  await todo.save();
  res.status(200).json(todo);
};

// DELETE a task from a todo
export const deleteTask = async (req: CustomRequest , res: Response): Promise<void> => {
  const { id, taskId } = req.params;

  const todo = await todoModel.findOne({ _id: id, user: req.user?._id });
  if (!todo) {
    res.status(404).json({ message: "Todo not found" });
    return;
  }

  todo.tasks = todo.tasks.filter(t => t.id !== taskId);
  await todo.save();

  res.status(200).json(todo);
};

// GET all tasks from a todo
export const getTasks = async (req: CustomRequest , res: Response): Promise<void> => {
  const { id } = req.params;
  const todo = await todoModel.findOne({ _id: id, user: req.user?._id });

  if (!todo) {
    res.status(404).json({ message: "Todo not found" });
    return;
  }

  res.status(200).json(todo.tasks);
};
