"use strict";
// This file defines the Mongoose schema and model for a "Todo" list document.
// Each Todo belongs to a user, has a title, an image, and a list of tasks.
// Tasks can include a description, completion status, and optional due date.
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Schema to define the structure of each task inside the tasks array
const TaskSchema = new mongoose_1.Schema({
    text: { type: String }, // Task text is optional
    completed: { type: Boolean, default: false }, // Defaults to false if not set
    date: { type: Date, default: null }, // Defaults to null if no date provided
});
// Schema for the main Todo document
const todoSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId, // User is referenced by ObjectId
        ref: "User", // Reference to the User model
    },
    title: { type: String }, // Optional title
    image: {
        secure_url: { type: String, required: true }, // Required image URL
        public_id: { type: String, required: true }, // Required public ID (e.g., for deletion)
    },
    tasks: [TaskSchema], // Array of embedded task documents
}, {
    versionKey: false, // Disables the __v version key
    timestamps: true, // Automatically adds createdAt and updatedAt
});
// Compile and export the model from the schema
const todoModel = (0, mongoose_1.model)("Todo", todoSchema);
exports.default = todoModel;
