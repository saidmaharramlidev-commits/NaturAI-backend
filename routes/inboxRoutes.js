import express from 'express';
import { identifyUser } from '../middleware/identifyUser.js';
import { getInbox, likeInboxItem } from '../controllers/inboxController.js';

const router = express.Router();

router.use(identifyUser);

router.get('/', getInbox);
router.patch('/:id/like', likeInboxItem);

export default router;