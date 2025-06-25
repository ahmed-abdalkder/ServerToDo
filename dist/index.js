"use strict";
// This is the main server setup file for the Express application.
// It configures environment variables, connects to the database, sets up middleware,
// defines routes, serves static files, starts a notification scheduler, and finally starts the server.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
process.env.TZ = 'UTC';
// Set the timezone environment variable to UTC to ensure consistent time handling across the app.
const path_1 = __importDefault(require("path"));
// Import path module to help resolve file paths.
const dotenv_1 = __importDefault(require("dotenv"));
// Import dotenv to load environment variables from a .env file.
dotenv_1.default.config({ path: path_1.default.resolve('config/.env') });
// Load environment variables from the .env file located in the config directory.
const express_1 = __importDefault(require("express"));
// Import Express framework to create the web server.
const cors_1 = __importDefault(require("cors"));
// Import CORS middleware to allow cross-origin requests.
const connection_DB_1 = __importDefault(require("./db/connection.DB"));
// Import the function to connect to the MongoDB database.
const todo_routes_1 = __importDefault(require("./module/todo/todo.routes"));
// Import the router that handles to-do related API endpoints.
const user_routes_1 = __importDefault(require("./module/users/user.routes"));
// Import the router that handles user authentication and related routes.
const sub_routes_1 = __importDefault(require("./module/subscriptions/sub.routes"));
// Import the router that handles subscription-related routes (e.g. push subscriptions).
const notificationScheduler_1 = __importDefault(require("./notificationScheduler"));
// Import the notification scheduler module responsible for scheduled notification tasks.
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
require("./middleware/googleAuth");
const app = (0, express_1.default)();
// Create an instance of the Express app.
const port = 5000;
// Define the port the server will listen on.
app.use(express_1.default.json());
// Middleware to parse incoming JSON requests.
app.use((0, cors_1.default)());
// Enable CORS for all routes to allow requests from different origins.
(0, connection_DB_1.default)();
// Connect to the MongoDB database.
app.use((0, express_session_1.default)({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, // خليه true فقط في production مع HTTPS
        maxAge: 1000 * 60 * 60 * 24, // يوم
    },
}));
// 🟦 إعداد passport
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// 🟩 طلب تسجيل الدخول بجوجل
app.get('/auth/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
// 🟩 الرابط اللي جوجل بيرجع عليه
app.get('/auth/google/callback', passport_1.default.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    const user = req.user;
    res.redirect(`http://localhost:5173?token=${user.token}`);
});
app.use('/uploads', express_1.default.static('uploads'));
// Serve static files from the 'uploads' directory for uploaded files (e.g., images).
notificationScheduler_1.default.start();
// Start the notification scheduler to handle periodic push notifications.
app.use("/api/todos", todo_routes_1.default);
// Mount the todo routes under the /api/todos path.
app.use("/api/users", user_routes_1.default);
// Mount the user routes under the /api/users path.
app.use("/subscriptions", sub_routes_1.default);
// Mount the subscription routes under the /subscriptions path.
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Server is up and running!' });
});
// A simple health check route to confirm the server is running.
app.listen(port, () => console.log(` Server listening on port ${port}`));
// Start the Express server and listen on the specified port.
