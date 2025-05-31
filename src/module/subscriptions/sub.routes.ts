import { Router } from "express";
import { saveSubscription, sendNotifications } from "./subscription.controler";
import { auth } from "../../middleware/auth";

const router = Router();

router.post('/api/save-subscription', auth(), saveSubscription);
router.post('/api/send-notification', auth(), sendNotifications);

export default router;
