import express from 'express';
import { createUser, updateUsername } from '../controllers/userController.js';

const router = express.Router();

router.post('/', createUser);
router.patch('/username', identifyUser, updateUsername);


export default router;