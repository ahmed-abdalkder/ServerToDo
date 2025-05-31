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
exports.sendNotifications = exports.saveSubscription = void 0;
const web_push_1 = __importDefault(require("web-push"));
const subscription_modle_1 = __importDefault(require("../../db/models/subscription.modle"));
const PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
web_push_1.default.setVapidDetails('mailto:your-email@example.com', PUBLIC_KEY || '', PRIVATE_KEY || '');
const saveSubscription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const subscription = req.body;
    if (!req.user) {
        res.status(400).json({ error: "User not found in request" });
        return;
    }
    if (!subscription || !subscription.endpoint) {
        res.status(400).json({ error: "Invalid subscription object" });
        return;
    }
    try {
        const exists = yield subscription_modle_1.default.findOne({
            userId: req.user._id,
            endpoint: subscription.endpoint,
        });
        if (exists) {
            res.status(200).json({ message: "Subscription already exists", subscription: exists });
            return;
        }
        const newSubscription = new subscription_modle_1.default(Object.assign(Object.assign({}, subscription), { userId: req.user._id }));
        yield newSubscription.save();
        res.status(201).json({ message: "Subscription saved", subscription: newSubscription });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to save subscription" });
    }
});
exports.saveSubscription = saveSubscription;
const sendNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = JSON.stringify({
        title: "New Notification!",
        body: "This is a test push message from the server ",
    });
    try {
        const subscriptions = yield subscription_modle_1.default.find({});
        const results = [];
        for (const sub of subscriptions) {
            try {
                yield web_push_1.default.sendNotification(sub, payload);
                results.push({ endpoint: sub.endpoint, success: true });
            }
            catch (err) {
                results.push({ endpoint: sub.endpoint, success: false, error: err });
            }
        }
        res.status(200).json({ message: "Notifications sent", results });
    }
    catch (_a) {
        res.status(500).json({ error: "Failed to send notifications" });
    }
});
exports.sendNotifications = sendNotifications;
