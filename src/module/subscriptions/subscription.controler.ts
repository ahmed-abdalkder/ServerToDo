import { Request, Response } from "express";
import webpush from "web-push";
import SubscriptionModel from "../../db/models/subscription.modle";

const  PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const  PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;

webpush.setVapidDetails(
  'mailto:your-email@example.com',
   PUBLIC_KEY || '',
  PRIVATE_KEY || ''
);

 
interface AuthRequest extends Request {
  user?: {
    _id: string;
    [key: string]: string | number;
  };
}

 

export const saveSubscription = async (req: AuthRequest, res: Response): Promise<void> => {
  const subscription = req.body;

  if (!req.user) {
   res.status(400).json({ error: "User not found in request" });
    return ;
  }

  if (!subscription || !subscription.endpoint) {
    res.status(400).json({ error: "Invalid subscription object" });
     return 
  }

  try {
    
    const exists = await SubscriptionModel.findOne({
      userId: req.user._id,
      endpoint: subscription.endpoint,
    });

    if (exists) {
        res.status(200).json({ message: "Subscription already exists", subscription: exists });
         return 
    }

    
    const newSubscription = new SubscriptionModel({
      ...subscription,
      userId: req.user._id,
    });

    await newSubscription.save();

    res.status(201).json({ message: "Subscription saved", subscription: newSubscription });
  } catch (error) {
    res.status(500).json({ error: "Failed to save subscription" });
  }
};

export const sendNotifications = async (req: Request, res: Response) => {
  const payload = JSON.stringify({
    title: "New Notification!",
    body: "This is a test push message from the server ",
  });

  try {
    const subscriptions = await SubscriptionModel.find({});

    const results: { endpoint: string; success: boolean; error?: unknown}[] = [];

    for (const sub of subscriptions) {
      try {
        await webpush.sendNotification(sub, payload);
        results.push({ endpoint: sub.endpoint, success: true });
      } catch (err) {
        results.push({ endpoint: sub.endpoint, success: false, error: err });
      }
    }

    res.status(200).json({ message: "Notifications sent", results });
  } catch  {
    res.status(500).json({ error: "Failed to send notifications" });
  }
};

 