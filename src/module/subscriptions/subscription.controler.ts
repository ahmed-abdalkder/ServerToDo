// // This file contains two controller functions:
// // 1. `saveSubscription` - saves a user's push subscription in the database.
// // 2. `sendNotifications` - sends push notifications to all stored subscriptions.
// // It uses the `web-push` library and a MongoDB model to handle notifications.

// import { Request, Response } from "express";
// // Importing Express types for type-checking the request and response objects.

// import webpush from "web-push";
// // Importing the web-push library used to send push notifications via VAPID.

// import SubscriptionModel from "../../db/models/subscription.modle";
// // Importing the Mongoose model for storing subscription data in MongoDB.

// const PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
// const PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
// // Get the VAPID public and private keys from environment variables.

// webpush.setVapidDetails(
//   'mailto:your-email@example.com', // Replace with a valid email address for VAPID
//   PUBLIC_KEY || '',
//   PRIVATE_KEY || ''
// );
// // Configure VAPID credentials used by the web-push service
 
// // Extend Express request object to include authenticated user
// interface AuthRequest extends Request {
//   user?: {
//     _id: string;
//     [key: string]: string | number;
//   };
// }

// // Controller to handle saving a user's push subscription
// export const saveSubscription = async (req: AuthRequest, res: Response): Promise<void> => {
//   const subscription = req.body;
// const userId = req.user?._id;
//   if (!userId)   res.status(401).json("Unauthorized");
//   // Check if user is present in the request (set by auth middleware)
//   if (!req.user) {
//     res.status(400).json({ error: "User not found in request" });
//     return;
//   }

//   // // Validate the subscription object
//   // if (!subscription || !subscription.endpoint) {
//   //   res.status(400).json({ error: "Invalid subscription object" });
//   //   return;
//   // }

//   try {
//     // Check if this subscription already exists for this user
//     const exists = await SubscriptionModel.findOne({
//       userId: req.user._id,
//       endpoint: subscription.endpoint,
//     });

//     if (exists) {
//       res.status(200).json({ message: "Subscription already exists", subscription: exists });
//       return;
//     }

//     // Save the new subscription in the database
//     const newSubscription = new SubscriptionModel({
//       ...subscription,
//       userId: req.user._id,
//     });
//    console.log("Before saving");

//   await newSubscription.save();
//   console.log("After saving");
 

//     res.status(201).json({ message: "Subscription saved", subscription: newSubscription });
//   } catch (error) {
//     res.status(500).json({ error: "Failed to save subscription" });
//   }
// };

// // Controller to send push notifications to all saved subscriptions
// export const sendNotifications = async (req: Request, res: Response) => {
//   const payload = JSON.stringify({
//     title: "New Notification!",
//     body: "This is a test push message from the server",
//   });
//   // Define the content of the notification

//   try {
//     const subscriptions = await SubscriptionModel.find({});
//     // Fetch all subscriptions from the database

//     const results: { endpoint: string; success: boolean; error?: unknown }[] = [];

//     // Loop through each subscription and attempt to send a notification
//     for (const sub of subscriptions) {
//       try {
//         await webpush.sendNotification(sub, payload);
//         results.push({ endpoint: sub.endpoint, success: true });
//       } catch (err) {
//         results.push({ endpoint: sub.endpoint, success: false, error: err });
//       }
//     }

//     res.status(200).json({ message: "Notifications sent", results });
//   } catch {
//     res.status(500).json({ error: "Failed to send notifications" });
//   }
// };


// This file contains two controller functions:
// 1. `saveSubscription` - saves a user's push subscription in the database.
// 2. `sendNotifications` - sends push notifications to all stored subscriptions.
// It uses the `web-push` library and a MongoDB model to handle notifications.

import { Request, Response } from "express";
// Express types for request and response objects

import webpush from "web-push";
// Library to send push notifications

import SubscriptionModel from "../../db/models/subscription.modle";
// Mongoose model for storing subscription data

// Load VAPID keys from environment variables
const PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || '';
const PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || '';

// Configure VAPID credentials for web-push
webpush.setVapidDetails(
  'mailto:your-email@example.com', // Replace with your email
  PUBLIC_KEY,
  PRIVATE_KEY
);

// ✅ Controller: Save a user's push subscription
export const saveSubscription = async (req: Request, res: Response): Promise<void> => {
  const subscription = req.body;

  const userId = req.user?._id;

  if (!userId) {
    res.status(401).json("Unauthorized");
    return;
  }

  try {
    const exists = await SubscriptionModel.findOne({
      userId,
      endpoint: subscription.endpoint,
    });

    if (exists) {
      res.status(200).json({ message: "Subscription already exists", subscription: exists });
      return;
    }

    const newSubscription = new SubscriptionModel({
      ...subscription,
      userId,
    });

    await newSubscription.save();

    res.status(201).json({ message: "Subscription saved", subscription: newSubscription });
  } catch (error) {
    res.status(500).json({ error: "Failed to save subscription" });
  }
};

// ✅ Controller: Send push notifications to all subscriptions
export const sendNotifications = async (req: Request, res: Response): Promise<void> => {
  const payload = JSON.stringify({
    title: "New Notification!",
    body: "This is a test push message from the server",
  });

  try {
    const subscriptions = await SubscriptionModel.find({});
    const results: { endpoint: string; success: boolean; error?: unknown }[] = [];

    for (const sub of subscriptions) {
      try {
        await webpush.sendNotification(sub, payload);
        results.push({ endpoint: sub.endpoint, success: true });
      } catch (err) {
        results.push({ endpoint: sub.endpoint, success: false, error: err });
      }
    }

    res.status(200).json({ message: "Notifications sent", results });
  } catch {
    res.status(500).json({ error: "Failed to send notifications" });
  }
};
 