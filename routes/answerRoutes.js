import express from 'express';
import { identifyUser } from '../middleware/identifyUser.js';
import { postAnswer, getAnswersForQuestion } from '../controllers/answerController.js';

const router = express.Router();

router.use(identifyUser);

router.post('/', postAnswer);
router.get('/:questionId', getAnswersForQuestion);

export default router;