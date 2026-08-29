import RoomMessage from '../models/RoomMessage.js';
import UserDailyProgress from '../models/UserDailyProgress.js';
import { checkAndCompleteDay } from './dailyProgressController.js';

const VALID_ROOMS = ['personal', 'job', 'relationships', 'general'];
const MAX_MESSAGES_PER_DAY = 3;
const MAX_MESSAGES_PER_ROOM = 50;

const getTodayString = () => {
    return new Date().toISOString().split('T')[0];
};

export const postRoomMessage = async (req, res) => {
    try {
        const { room, text } = req.body;
        const userId = req.user._id;

        if (!VALID_ROOMS.includes(room)) {
            return res.status(400).json({ error: 'Invalid room' });
        }

        if (!text || !text.trim().length) {
            return res.status(400).json({ error: 'Text is required' });
        }

        if (text.length > 500) {
            return res.status(400).json({ error: 'Text is too long' });
        }

        // Check user's daily post limit (3 per day, across all rooms)
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const postsToday = await RoomMessage.countDocuments({
            postedBy: userId,
            createdAt: { $gte: startOfDay },
        });

        if (postsToday >= MAX_MESSAGES_PER_DAY) {
            return res.status(429).json({ error: 'Daily posting limit reached' });
        }

        // General room = "general" type, others = "question" type
        const type = room === 'general' ? 'general' : 'question';

        const message = await RoomMessage.create({
            room,
            text: text.trim(),
            type,
            postedBy: userId,
        });

        // Enforce 50-message FIFO cap per room
        const countInRoom = await RoomMessage.countDocuments({ room });
        if (countInRoom > MAX_MESSAGES_PER_ROOM) {
            const excess = countInRoom - MAX_MESSAGES_PER_ROOM;
            const oldestMessages = await RoomMessage.find({ room })
                .sort({ createdAt: 1 })
                .limit(excess);
            const idsToDelete = oldestMessages.map((m) => m._id);
            await RoomMessage.deleteMany({ _id: { $in: idsToDelete } });
        }

        // Mark today's room activity as done (feeds streak logic)
        const today = getTodayString();
        const progress = await UserDailyProgress.findOne({ user: userId, date: today });
        if (progress && !progress.roomActivityDone) {
            progress.roomActivityDone = true;
            await progress.save();
            await checkAndCompleteDay(progress, userId);
        }

        res.status(201).json(message);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

export const getRoomMessages = async (req, res) => {
    try {
        const { room } = req.params;

        if (!VALID_ROOMS.includes(room)) {
            return res.status(400).json({ error: 'Invalid room' });
        }

        const messages = await RoomMessage.find({ room })
            .sort({ createdAt: -1 })
            .populate('postedBy', 'username');

        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
};