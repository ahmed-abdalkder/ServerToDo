import cron from "node-cron";
import webPush, { PushSubscription } from "web-push";
import mongoose from "mongoose";
import todoModel, { ITodo } from "./db/models/todomodel";
import SubscriptionModel, { ISubscription } from "./db/models/subscription.modle";

 const PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY
 const PRIVATE_KEY= process.env.VAPID_PRIVATE_KEY

webPush.setVapidDetails(
  'mailto:you@example.com',
  PUBLIC_KEY || '',
  PRIVATE_KEY || ''
);
 
 const notificationScheduler = cron.schedule("* * * * *", async () => {
  
  const now = new Date();
  const oneMinuteAgo = new Date(now.getTime() - 60000);

  try {
    const todos = await todoModel.find({
     tasks: {
    $elemMatch: {
      date: { $lte: now, $gt: oneMinuteAgo },
      completed: false
    }
  }
    }).populate("user") as (ITodo & { user?: { _id: mongoose.Types.ObjectId } })[];

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

          const subscription = await SubscriptionModel.findOne({ userId }) as ISubscription | null;

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
          } else {
            console.warn(` No subscription found for user ${userId}`);
          }
        }
      }
      }
    }
  } catch (err) {
    console.error(" Error in notificationScheduler:", err);
  }
});

export default notificationScheduler;

  

 