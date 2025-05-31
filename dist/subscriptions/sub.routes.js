"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subscription_controler_1 = require("./subscription.controler");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.post('/api/save-subscription', (0, auth_1.auth)(), subscription_controler_1.saveSubscription);
router.post('/api/send-notification', (0, auth_1.auth)(), subscription_controler_1.sendNotifications);
exports.default = router;
