
import webpush, { PushSubscription } from "web-push";

async function sendNotification(subscription: PushSubscription, payload: object): Promise<void> {
  await webpush.sendNotification(subscription, JSON.stringify(payload));
}



export default sendNotification;

