
// This component defines a utility function to send push notifications using the web-push library.
// It exports the sendNotification function as the default export.

import webpush, { PushSubscription } from "web-push";
// Import the web-push library and the PushSubscription type for typing the subscription parameter.

async function sendNotification(subscription: PushSubscription, payload: object): Promise<void> {
  // Send a push notification to the given subscription with the provided payload.
  // The payload is converted to a JSON string before sending.
  await webpush.sendNotification(subscription, JSON.stringify(payload));
}

export default sendNotification; 
// Export the sendNotification function as the default export of this module.


