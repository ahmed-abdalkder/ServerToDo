// This is the main server setup file for the Express application.
// It configures environment variables, connects to the database, sets up middleware,
// defines routes, serves static files, starts a notification scheduler, and finally starts the server.

process.env.TZ = 'UTC';
// Set the timezone environment variable to UTC to ensure consistent time handling across the app.

import path from 'path';
// Import path module to help resolve file paths.

import dotenv from 'dotenv';
// Import dotenv to load environment variables from a .env file.

dotenv.config({ path: path.resolve('config/.env') });
// Load environment variables from the .env file located in the config directory.

import express from 'express';
// Import Express framework to create the web server.

import cors from 'cors';
// Import CORS middleware to allow cross-origin requests.

import connectDB from './db/connection.DB';
// Import the function to connect to the MongoDB database.

import todorouter from './module/todo/todo.routes';
// Import the router that handles to-do related API endpoints.

import userrouter from './module/users/user.routes';
// Import the router that handles user authentication and related routes.

import subrouter from './module/subscriptions/sub.routes';
// Import the router that handles subscription-related routes (e.g. push subscriptions).

import notificationScheduler from './notificationScheduler';
// Import the notification scheduler module responsible for scheduled notification tasks.

const app = express();
// Create an instance of the Express app.

const port = 3000;
// Define the port the server will listen on.

app.use(express.json());
// Middleware to parse incoming JSON requests.

app.use(cors());
// Enable CORS for all routes to allow requests from different origins.

connectDB();
// Connect to the MongoDB database.

app.use('/uploads', express.static('uploads'));
// Serve static files from the 'uploads' directory for uploaded files (e.g., images).

notificationScheduler.start();
// Start the notification scheduler to handle periodic push notifications.

app.use("/api/todos", todorouter);
// Mount the todo routes under the /api/todos path.

app.use("/api/users", userrouter);
// Mount the user routes under the /api/users path.

app.use("/subscriptions", subrouter);
// Mount the subscription routes under the /subscriptions path.

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Server is up and running!' });
});
// A simple health check route to confirm the server is running.

app.listen(port, () => console.log(` Server listening on port ${port}`));
// Start the Express server and listen on the specified port.

