import express from 'express';
import { identifyUser } from '../middleware/identifyUser.js';
import { createUser, updateUsername, getMe } from '../controllers/userController.js';

const router = express.Router();

router.post('/', createUser);
router.patch('/username', identifyUser, updateUsername);
router.get('/me', identifyUser, getMe);


export default router;