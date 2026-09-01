import Answer from '../models/Answer.js';
import RoomMessage from '../models/RoomMessage.js';
import InboxItem from '../models/InboxItem.js';
import { containsProfanity } from '../wordFilter.js';

const MAX_ANSWERS_PER_QUESTION = 5;

export const postAnswer = async (req, res) => {
    try {
        const { questionId, text } = req.body;
        const userId = req.user._id;

        if (!text || !text.trim().length) {
            return res.status(400).json({ error: 'Text is required' });
        }

        if (text.length > 500) {
            return res.status(400).json({ error: 'Text is too long' });

        }

        if (containsProfanity(text)) {
            return res.status(400).json({ error: 'Your message contains inappropriate language' });
        }

        const question = await RoomMessage.findById(questionId);

        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }

        if (question.type !== 'question') {
            return res.status(400).json({ error: 'This post cannot be answered' });
        }

        if (question.postedBy.toString() === userId.toString()) {
            return res.status(403).json({ error: "You can't answer your own question" });
        }

        if (question.answerCount >= MAX_ANSWERS_PER_QUESTION) {
            return res.status(400).json({ error: 'This question already has the maximum number of answers' });
        }

        // Create the answer (lives in the room, tied to the question)
        const answer = await Answer.create({
            question: questionId,
            text: text.trim(),
            answeredBy: userId,
        });

        question.answerCount += 1;
        await question.save();

        // Deliver a copy into the asker's Inbox
        let inboxItem = await InboxItem.findOne({ originalQuestion: questionId, askedBy: question.postedBy });

        if (!inboxItem) {
            inboxItem = await InboxItem.create({
                originalQuestion: questionId,
                questionText: question.text,
                askedBy: question.postedBy,
                answers: [],
            });
        }

        inboxItem.answers.push({
            answerRef: answer._id,
            text: text.trim(),
            answeredBy: userId,
        });
        await inboxItem.save();

        res.status(201).json(answer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

export const getAnswersForQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;
        const userId = req.user._id;

        const question = await RoomMessage.findById(questionId);

        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }

        if (question.postedBy.toString() !== userId.toString()) {
            return res.status(403).json({ error: 'Only the asker can view these answers' });
        }

        const answers = await Answer.find({ question: questionId })
            .sort({ createdAt: 1 })
            .populate('answeredBy', 'username');

        res.json(answers);
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
};