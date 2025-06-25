"use strict";
// This module defines a scheduled task using node-cron to send push notifications
// to users reminding them about due tasks in their todo lists.
// It checks every minute for tasks that became due in the last minute and sends notifications
// to the corresponding subscribed users using the web-push library.
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
// Import node-cron for scheduling recurring jobs.
const web_push_1 = __importDefault(require("web-push"));
// Import mongoose for MongoDB object modeling and types.
const todomodel_1 = __importDefault(require("./db/models/todomodel"));
// Import the todoModel and ITodo interface representing todo documents.
const subscription_modle_1 = __importDefault(require("./db/models/subscription.modle"));
// Import the subscription model and ISubscription interface representing user push subscriptions.
const PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
// Get VAPID public key from environment variables.
const PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
// Get VAPID private key from environment variables.
web_push_1.default.setVapidDetails('mailto:you@example.com', PUBLIC_KEY || '', PRIVATE_KEY || '');
// Configure web-push with contact email and VAPID keys for authentication.
const notificationScheduler = node_cron_1.default.schedule("* * * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    // Schedule a task that runs every minute.
    var _a;
    const now = new Date();
    const oneMinuteAgo = new Date(now.getTime() - 60000);
    // Define current time and one minute before current time.
    try {
        const todos = yield todomodel_1.default.find({
            tasks: {
                $elemMatch: {
                    date: { $lte: now, $gt: oneMinuteAgo },
                    completed: false
                }
            }
        }).populate("user");
        // Query todos containing tasks that are due between oneMinuteAgo and now and not completed,
        // populate user field to get user id.
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
                        // Skip if no user id available.
                        const subscription = yield subscription_modle_1.default.findOne({ userId });
                        // Find the user's push subscription.
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
                            // Send push notification with task reminder.
                        }
                        else {
                            console.warn(` No subscription found for user ${userId}`);
                            // Warn if no subscription found for user.
                        }
                    }
                }
            }
        }
    }
    catch (err) {
        console.error(" Error in notificationScheduler:", err);
        // Log any errors during the notification scheduling.
    }
}));
exports.default = notificationScheduler;
// Export the scheduler so it can be started from the main server file.
