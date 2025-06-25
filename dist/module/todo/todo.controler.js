"use strict";
// // This controller handles CRUD operations for a To-Do list application.
// // It supports creating todos (with image upload), fetching, updating, deleting todos,
// // and managing tasks within each todo. Each operation is user-specific.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTasks = exports.deleteTask = exports.updateTask = exports.deleteTodo = exports.addTask = exports.createTodo = exports.getTodo = exports.getTodos = void 0;
const cloudinary_1 = __importDefault(require("../../service/cloudinary"));
const todomodel_1 = __importDefault(require("../../db/models/todomodel"));
// Controller: GET all todos for the authenticated user
const getTodos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const todos = yield todomodel_1.default.find({ user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id });
    res.json(todos);
});
exports.getTodos = getTodos;
// Controller: GET a single todo by its title
const getTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title } = req.params;
    const todo = yield todomodel_1.default.findOne({ title });
    res.json(todo);
});
exports.getTodo = getTodo;
// Controller: CREATE a new todo with image upload
const createTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { title } = req.body;
        if (!req.file) {
            res.status(401).json({ message: "please add image" });
            return;
        }
        const result = yield cloudinary_1.default.uploader.upload(req.file.path, {
            folder: `Todo-list/task`,
        });
        const todo = yield todomodel_1.default.create({
            user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
            title,
            image: {
                secure_url: result.secure_url,
                public_id: result.public_id,
            },
            tasks: [],
        });
        res.status(201).json(todo);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: 'Something went wrong' });
        }
    }
});
exports.createTodo = createTodo;
// Controller: ADD a new task to a specific todo
const addTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const { text, date } = req.body;
    const todo = yield todomodel_1.default.findOne({ _id: id, user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id });
    if (!todo) {
        res.status(404).json({ message: "Todo not found" });
        return;
    }
    todo.tasks.push({ text, date: new Date(date) });
    yield todo.save();
    res.json(todo);
});
exports.addTask = addTask;
// Controller: DELETE a todo by ID
const deleteTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const todo = yield todomodel_1.default.findOneAndDelete({ _id: id, user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id });
    if (!todo) {
        res.status(404).json({ message: "To-Do not found" });
        return;
    }
    res.json({ message: "To-Do deleted successfully", todo });
});
exports.deleteTodo = deleteTodo;
// Controller: UPDATE a specific task within a todo
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id, taskId } = req.params;
    const { text, completed } = req.body;
    const todo = yield todomodel_1.default.findOne({ _id: id, user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id });
    if (!todo) {
        res.status(404).json({ message: "Todo not found" });
        return;
    }
    const task = todo.tasks.find(t => t.id === taskId);
    if (!task) {
        res.status(404).json({ message: "Task not found" });
        return;
    }
    if (text !== undefined)
        task.text = text;
    if (completed !== undefined)
        task.completed = completed;
    yield todo.save();
    res.status(200).json(todo);
});
exports.updateTask = updateTask;
// Controller: DELETE a specific task from a todo
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id, taskId } = req.params;
    const todo = yield todomodel_1.default.findOne({ _id: id, user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id });
    if (!todo) {
        res.status(404).json({ message: "Todo not found" });
        return;
    }
    todo.tasks = todo.tasks.filter(t => t.id !== taskId);
    yield todo.save();
    res.status(200).json(todo);
});
exports.deleteTask = deleteTask;
// Controller: GET all tasks from a specific todo
const getTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const todo = yield todomodel_1.default.findOne({ _id: id, user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id });
    if (!todo) {
        res.status(404).json({ message: "Todo not found" });
        return;
    }
    res.status(200).json(todo.tasks);
});
exports.getTasks = getTasks;
