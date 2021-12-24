import express from 'express';

import { sendMessageToDiscord } from '@/controller/notification';

const router = express.Router();
router.post('/notifications', sendMessageToDiscord);

export default router;
