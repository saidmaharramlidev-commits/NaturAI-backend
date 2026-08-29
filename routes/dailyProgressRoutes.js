import express from 'express';
import { identifyUser } from '../middleware/identifyUser.js';
import { getTodayProgress, markQuoteSeen, markStorySeen } from '../controllers/dailyProgressController.js';

const router = express.Router();

router.use(identifyUser); // every route below requires a valid JWT

router.get('/today', getTodayProgress);
router.post('/quote-seen', markQuoteSeen);
router.post('/story-seen', markStorySeen);

export default router;