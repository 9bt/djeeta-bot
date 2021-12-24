import express from 'express';

import { preventFromSleepingInstance } from '@/controller/common';
import { sendMessageToDiscord } from '@/controller/notification';

const router = express.Router();
router.post('/', preventFromSleepingInstance);
router.post('/notifications', sendMessageToDiscord);

export default router;
