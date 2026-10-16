import { Router } from 'express';
import {
connectSlack,
slackCallback,
slackStatus,
} from './slack.controller.js';

const router = Router();

router.get('/connect', connectSlack);
router.get('/callback', slackCallback);
router.get('/status', slackStatus);

export default router;
