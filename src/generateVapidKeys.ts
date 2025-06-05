
// This component generates a new pair of VAPID keys used for web push notifications.
// It prints the generated public and private keys to the console.

import webpush from 'web-push';
// Import the web-push library to use its functionality for generating VAPID keys.

const vapidKeys: { publicKey: string; privateKey: string } = webpush.generateVAPIDKeys();
// Generate a new set of VAPID keys (public and private) for authenticating push notifications.

console.log('Public Key:', vapidKeys.publicKey);
// Log the generated public key to the console for use in client-side push subscription.

console.log('Private Key:', vapidKeys.privateKey);
// Log the generated private key to the console for server-side use in sending notifications securely.





 