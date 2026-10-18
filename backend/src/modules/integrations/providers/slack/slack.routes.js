import { Router } from 'express';
import {
  connectSlack,
  slackCallback,
  slackStatus,
  slackChannels,
  slackMessages,
  sendMessage
} from './slack.controller.js';

const router = Router();

router.get('/connect', connectSlack);
router.get('/callback', slackCallback);
router.get('/status', slackStatus);
router.get('/channels', slackChannels);
router.get('/channels/:id/messages', slackMessages);
router.post('/send', sendMessage);

export default router;