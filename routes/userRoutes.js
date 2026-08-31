import express from 'express';
import { identifyUser } from '../middleware/identifyUser.js';
import { createUser, updateUsername, getMe, recoverAccount } from '../controllers/userController.js';

const router = express.Router();

router.post('/', createUser);
router.patch('/username', identifyUser, updateUsername);
router.get('/me', identifyUser, getMe);
router.post('/recover', recoverAccount);

export default router;