import express from 'express';
import { identifyUser } from '../middleware/identifyUser.js';
import { createReport } from '../controllers/reportController.js';

const router = express.Router();

router.use(identifyUser);
router.post('/', createReport);

export default router;