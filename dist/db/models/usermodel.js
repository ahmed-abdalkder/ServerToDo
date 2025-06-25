"use strict";
// This file defines the Mongoose schema and model for a "User" document.
// It includes fields like name, email, and password, and automatically manages creation and update timestamps.
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Define the schema structure for a User
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String
    },
    googleId: {
        type: String
    },
    picture: {
        type: String
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: 'user'
    },
}, {
    versionKey: false, // Disables the default __v version field
    timestamps: true, // Enables automatic createdAt and updatedAt fields
});
// Compile the schema into a model that can be used throughout the app
const userModel = (0, mongoose_1.model)("User", userSchema);
// Export the compiled model so it can be imported in other parts of the application
exports.default = userModel;
