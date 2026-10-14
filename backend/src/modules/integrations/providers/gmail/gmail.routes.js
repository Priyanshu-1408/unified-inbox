import { Router } from 'express';
import {
  connectGmail,
  gmailCallback,
  gmailStatus,
   gmailMessages,
} from './gmail.controller.js';

const router = Router();

router.get('/connect', connectGmail);
router.get('/callback', gmailCallback);
router.get('/status', gmailStatus);
router.get('/messages', gmailMessages);

export default router;