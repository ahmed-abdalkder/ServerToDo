// This file defines and exports routes related to push notification subscriptions.
// It includes routes to save a user's subscription info and to send notifications.
// These routes are protected by the authentication middleware.

import { Router } from "express";
// Import Express Router to define route handlers.

import { saveSubscription, sendNotifications } from "./subscription.controler";
// Import the controller functions for handling subscription and notification logic.

import { auth } from "../../middleware/auth";
// Import the authentication middleware to protect the routes.

const router = Router();
// Initialize a new router instance

// Route to save a push subscription to the database
// This route is protected by the auth middleware
router.post('/api/save-subscription', auth(), saveSubscription);

// Route to send push notifications to all saved subscriptions
// Also protected by the auth middleware
router.post('/api/send-notification', auth(), sendNotifications);

// Export the router so it can be used in the main app
export default router;

