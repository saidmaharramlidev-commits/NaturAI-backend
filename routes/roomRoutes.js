import express from 'express';
import { identifyUser } from '../middleware/identifyUser.js';

import { postRoomMessage, getRoomMessages } from '../controllers/roomController.js';

const router = express.Router();

router.use(identifyUser);

router.post('/', postRoomMessage);
router.get('/:room', getRoomMessages);

export default router;