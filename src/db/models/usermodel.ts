// This file defines the Mongoose schema and model for a "User" document.
// It includes fields like name, email, and password, and automatically manages creation and update timestamps.

import { Document, Schema, model } from "mongoose";
// Importing required elements from Mongoose:
// - Document: used to extend our interface for strong typing
// - Schema: used to define the structure of the MongoDB document
// - model: used to compile the schema into a usable model

// Interface representing a User document in MongoDB
export interface IUser extends Document {
  name: string;        // The user's full name
  email: string;       // The user's email address (must be unique)
  password: string;    // The user's hashed password
  createdAt: Date;     // Automatically generated timestamp for creation
  updatedAt: Date;     // Automatically generated timestamp for last update
  role:string;
  googleId:string;
  picture:string;
}

// Define the schema structure for a User
const userSchema = new Schema<IUser>({
   
    name: {
    type: String,
     trim:true,
    required: true,

  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim:true
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
    enum: ["user","admin"],
    default: 'user'
  },
}, {
  versionKey: false,      // Disables the default __v version field
  timestamps: true,       // Enables automatic createdAt and updatedAt fields
});

// Compile the schema into a model that can be used throughout the app
const userModel = model<IUser>("User", userSchema);

// Export the compiled model so it can be imported in other parts of the application
export default userModel;


