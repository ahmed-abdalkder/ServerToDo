"use strict";
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
const node_cron_1 = __importDefault(require("node-cron"));
const web_push_1 = __importDefault(require("web-push"));
const todomodel_1 = __importDefault(require("./db/models/todomodel"));
const subscription_modle_1 = __importDefault(require("./db/models/subscription.modle"));
const PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
web_push_1.default.setVapidDetails('mailto:you@example.com', PUBLIC_KEY || '', PRIVATE_KEY || '');
const notificationScheduler = node_cron_1.default.schedule("* * * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const now = new Date();
    const oneMinuteAgo = new Date(now.getTime() - 60000);
    try {
        const todos = yield todomodel_1.default.find({
            tasks: {
                $elemMatch: {
                    date: { $lte: now, $gt: oneMinuteAgo },
                    completed: false
                }
            }
        }).populate("user");
        for (const todo of todos) {
            for (const task of todo.tasks) {
                if (task.date) {
                    const taskDate = new Date(task.date);
                    if (taskDate <= now &&
                        taskDate > oneMinuteAgo &&
                        !task.completed) {
                        const userId = (_a = todo.user) === null || _a === void 0 ? void 0 : _a._id;
                        if (!userId)
                            continue;
                        const subscription = yield subscription_modle_1.default.findOne({ userId });
                        if (subscription) {
                            const { endpoint, keys } = subscription;
                            yield web_push_1.default.sendNotification({
                                endpoint,
                                keys: {
                                    p256dh: keys.p256dh,
                                    auth: keys.auth
                                }
                            }, JSON.stringify({
                                title: "⏰ Task Reminder",
                                body: `thisTask "${task.text}" from ToDo "${todo.title}" is due now!`
                            }));
                        }
                        else {
                            console.warn(` No subscription found for user ${userId}`);
                        }
                    }
                }
            }
        }
    }
    catch (err) {
        console.error(" Error in notificationScheduler:", err);
    }
}));
exports.default = notificationScheduler;
