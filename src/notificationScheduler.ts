// This module defines a scheduled task using node-cron to send push notifications
// to users reminding them about due tasks in their todo lists.
// It checks every minute for tasks that became due in the last minute and sends notifications
// to the corresponding subscribed users using the web-push library.

import cron from "node-cron";
// Import node-cron for scheduling recurring jobs.

import webPush, { PushSubscription } from "web-push";
// Import web-push to send push notifications and the PushSubscription type.

import mongoose from "mongoose";
// Import mongoose for MongoDB object modeling and types.

import todoModel, { ITodo } from "./db/models/todomodel";
// Import the todoModel and ITodo interface representing todo documents.

import SubscriptionModel, { ISubscription } from "./db/models/subscription.modle";
// Import the subscription model and ISubscription interface representing user push subscriptions.

const PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
// Get VAPID public key from environment variables.

const PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
// Get VAPID private key from environment variables.

webPush.setVapidDetails(
  'mailto:you@example.com',
  PUBLIC_KEY || '',
  PRIVATE_KEY || ''
);
// Configure web-push with contact email and VAPID keys for authentication.

const notificationScheduler = cron.schedule("* * * * *", async () => {
  // Schedule a task that runs every minute.

  const now = new Date();
  const oneMinuteAgo = new Date(now.getTime() - 60000);
  // Define current time and one minute before current time.

  try {
    const todos = await todoModel.find({
      tasks: {
        $elemMatch: {
          date: { $lte: now, $gt: oneMinuteAgo },
          completed: false
        }
      }
    }).populate("user") as (ITodo & { user?: { _id: mongoose.Types.ObjectId } })[];
    // Query todos containing tasks that are due between oneMinuteAgo and now and not completed,
    // populate user field to get user id.

    for (const todo of todos) {
      for (const task of todo.tasks) {
        if (task.date) {
          const taskDate = new Date(task.date);
          if (
            taskDate <= now &&
            taskDate > oneMinuteAgo &&
            !task.completed
          ) {
            const userId = todo.user?._id;
            if (!userId) continue;
            // Skip if no user id available.

            const subscription = await SubscriptionModel.findOne({ userId }) as ISubscription | null;
            // Find the user's push subscription.

            if (subscription) {
              const { endpoint, keys } = subscription;

              await webPush.sendNotification(
                {
                  endpoint,
                  keys: {
                    p256dh: keys.p256dh,
                    auth: keys.auth
                  }
                } as PushSubscription,
                JSON.stringify({
                  title: "⏰ Task Reminder",
                  body: `thisTask "${task.text}" from ToDo "${todo.title}" is due now!`
                })
              );
              // Send push notification with task reminder.
            } else {
              console.warn(` No subscription found for user ${userId}`);
              // Warn if no subscription found for user.
            }
          }
        }
      }
    }
  } catch (err) {
    console.error(" Error in notificationScheduler:", err);
    // Log any errors during the notification scheduling.
  }
});

export default notificationScheduler;
// Export the scheduler so it can be started from the main server file.

  
 