// This file defines the Mongoose schema and model for a "Todo" list document.
// Each Todo belongs to a user, has a title, an image, and a list of tasks.
// Tasks can include a description, completion status, and optional due date.

import mongoose, { Document, Schema, model } from "mongoose";
// Importing required elements from Mongoose:
// - mongoose for general MongoDB functionality
// - Document interface for strong typing in TypeScript
// - Schema and model to define and compile the schema

// Interface representing the shape of an individual task within a todo
export interface ITask {
  id?: string;             // Optional local identifier (not stored in DB unless manually added)
  text?: string;           // Task description
  completed?: boolean;     // Whether the task is completed
  date?: Date | null;      // Optional due date
}

// Interface representing the full Todo document in MongoDB
export interface ITodo extends Document {
  user?: mongoose.Types.ObjectId; // Optional reference to the user who owns this todo
  title?: string;                // Optional title of the todo list
  image: {                       // Required image information
    secure_url: string;         // The secure image URL (e.g., from Cloudinary)
    public_id: string;          // The public ID used to identify/delete the image
  };
  tasks: ITask[];               // Array of task objects embedded inside the todo
  createdAt: Date;              // Auto-generated timestamp of creation
  updatedAt: Date;              // Auto-generated timestamp of last update
}

// Schema to define the structure of each task inside the tasks array
const TaskSchema = new Schema<ITask>({
  text: { type: String },                          // Task text is optional
  completed: { type: Boolean, default: false },    // Defaults to false if not set
  date: { type: Date, default: null },             // Defaults to null if no date provided
});

// Schema for the main Todo document
const todoSchema = new Schema<ITodo>({
  user: {
    type: Schema.Types.ObjectId, // User is referenced by ObjectId
    ref: "User",                 // Reference to the User model
  },
  title: { type: String },       // Optional title
  image: {
    secure_url: { type: String, required: true }, // Required image URL
    public_id: { type: String, required: true },  // Required public ID (e.g., for deletion)
  },
  tasks: [TaskSchema],           // Array of embedded task documents
}, {
  versionKey: false,             // Disables the __v version key
  timestamps: true,              // Automatically adds createdAt and updatedAt
});

// Compile and export the model from the schema
const todoModel = model<ITodo>("Todo", todoSchema);

export default todoModel;


