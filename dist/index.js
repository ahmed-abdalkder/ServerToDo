"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const i18nextMiddleware = __importStar(require("i18next-http-middleware"));
const i18next_1 = __importDefault(require("i18next"));
const i18next_fs_backend_1 = __importDefault(require("i18next-fs-backend"));
const connection_DB_1 = __importDefault(require("./db/connection.DB"));
const todo_routes_1 = __importDefault(require("./module/todo/todo.routes"));
const user_routes_1 = __importDefault(require("./module/users/user.routes"));
const sub_routes_1 = __importDefault(require("./module/subscriptions/sub.routes"));
const notificationScheduler_1 = __importDefault(require("./notificationScheduler"));
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
i18next_1.default
    .use(i18next_fs_backend_1.default)
    .use(i18nextMiddleware.LanguageDetector)
    .init({
    fallbackLng: 'en',
    backend: {
        loadPath: path_1.default.join(__dirname, '/locales/{{lng}}/translation.json'),
    },
    detection: {
        order: ['header'],
        caches: false,
    },
    preload: ['en', 'ar'],
    initImmediate: false,
});
const middlewareHandle = i18nextMiddleware.handle;
app.use(middlewareHandle(i18next_1.default));
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
app.get('/', (req, res) => {
    const t = req.t;
    res.send({
        message: t('task_reminder_title'),
        language: req.language,
    });
});
//  Start Server
app.listen(port, () => console.log(` Server listening on port ${port}`));
