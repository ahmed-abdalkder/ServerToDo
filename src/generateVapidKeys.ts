
import webpush from 'web-push';

 const vapidKeys: { publicKey: string; privateKey: string } = webpush.generateVAPIDKeys();

console.log('Public Key:', vapidKeys.publicKey);
console.log('Private Key:', vapidKeys.privateKey);




 