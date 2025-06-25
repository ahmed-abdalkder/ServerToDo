"use strict";
// This file defines and exports routes related to push notification subscriptions.
// It includes routes to save a user's subscription info and to send notifications.
// These routes are protected by the authentication middleware.
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// Import Express Router to define route handlers.
const subscription_controler_1 = require("./subscription.controler");
// Import the controller functions for handling subscription and notification logic.
const auth_1 = require("../../middleware/auth");
// Import the authentication middleware to protect the routes.
const router = (0, express_1.Router)();
// Initialize a new router instance
// Route to save a push subscription to the database
// This route is protected by the auth middleware
router.post('/api/save-subscription', (0, auth_1.auth)(), subscription_controler_1.saveSubscription);
// Route to send push notifications to all saved subscriptions
// Also protected by the auth middleware
router.post('/api/send-notification', (0, auth_1.auth)(), subscription_controler_1.sendNotifications);
// Export the router so it can be used in the main app
exports.default = router;
