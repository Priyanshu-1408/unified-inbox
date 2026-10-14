import { Router } from 'express';
import {
  connectGmail,
  gmailCallback,
  gmailStatus,
   gmailMessages,
   gmailMessage,
   sendEmail
} from './gmail.controller.js';

const router = Router();

router.get('/connect', connectGmail);
router.get('/callback', gmailCallback);
router.get('/status', gmailStatus);
router.get('/messages', gmailMessages);
router.get('/messages/:id', gmailMessage);
router.post('/send', sendEmail);
export default router;