"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
process.env.TZ = 'UTC';
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: path_1.default.resolve('config/.env') });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const connection_DB_1 = __importDefault(require("./db/connection.DB"));
const todo_routes_1 = __importDefault(require("./module/todo/todo.routes"));
const user_routes_1 = __importDefault(require("./module/users/user.routes"));
const sub_routes_1 = __importDefault(require("./module/subscriptions/sub.routes"));
const notificationScheduler_1 = __importDefault(require("./notificationScheduler"));
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// i18next
//   .use(Backend)
//   .use((i18nextMiddleware as any).LanguageDetector)
//   .init({
//     fallbackLng: 'en',
//     backend: {
//       loadPath: path.join(__dirname, '/locales/{{lng}}/translation.json'),
//     },
//     detection: {
//       order: ['header'],
//       caches: false,
//     },
//     preload: ['en', 'ar'], 
//     initImmediate: false,
//   });
// const middlewareHandle = (i18nextMiddleware as any).handle;
// app.use(middlewareHandle(i18next));
//  Static uploads
app.use('/uploads', express_1.default.static('uploads'));
//  Connect DB
(0, connection_DB_1.default)();
//  Scheduler
notificationScheduler_1.default.start();
//  Routes
app.use("/api/todos", todo_routes_1.default);
app.use("/api/users", user_routes_1.default);
app.use("/subscriptions", sub_routes_1.default);
//  Test translation route
// app.get('/', (req, res) => {
//   const t = (req as any).t;
//   res.send({
//     message: t('task_reminder_title'),
//     language: (req as any).language,
//   });
// });
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Server is up and running!' });
});
//  Start Server
app.listen(port, () => console.log(` Server listening on port ${port}`));
