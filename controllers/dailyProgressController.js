import DailyContent from '../models/DailyContent.js';
import UserDailyProgress from '../models/UserDailyProgress.js';
import User from '../models/User.js';

const getTodayString = () => {
    return new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
};

// GET today's progress (creates it if it doesn't exist yet)
export const getTodayProgress = async (req, res) => {
    try {
        const userId = req.user._id;
        const today = getTodayString();

        let progress = await UserDailyProgress.findOne({ user: userId, date: today })
            .populate('assignedQuote')
            .populate('assignedStory');

        if (!progress) {
            const quotes = await DailyContent.aggregate([
                { $match: { type: 'quote', active: true } },
                { $sample: { size: 1 } },
            ]);
            const stories = await DailyContent.aggregate([
                { $match: { type: 'story', active: true } },
                { $sample: { size: 1 } },
            ]);

            if (!quotes.length || !stories.length) {
                return res.status(500).json({ error: 'No content available yet' });
            }

            progress = await UserDailyProgress.create({
                user: userId,
                date: today,
                assignedQuote: quotes[0]._id,
                assignedStory: stories[0]._id,
            });

            progress = await UserDailyProgress.findById(progress._id)
                .populate('assignedQuote')
                .populate('assignedStory');
        }

        res.json(progress);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

// Check if all 3 tasks are done, complete the day + update streak
export const checkAndCompleteDay = async (progress, userId) => {
    if (progress.quoteSeen && progress.storySeen && progress.roomActivityDone && !progress.isDayComplete) {
        progress.isDayComplete = true;
        await progress.save();

        const user = await User.findById(userId);
        const today = getTodayString();
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        if (user.lastCompletedDate === yesterday) {
            user.streak += 1;
        } else {
            user.streak = 1;
        }
        user.lastCompletedDate = today;
        await user.save();
    }
};

export const markQuoteSeen = async (req, res) => {
    try {
        const today = getTodayString();
        const progress = await UserDailyProgress.findOne({ user: req.user._id, date: today });
        if (!progress) return res.status(404).json({ error: 'No progress found for today' });

        progress.quoteSeen = true;
        await progress.save();
        await checkAndCompleteDay(progress, req.user._id);

        res.json(progress);
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
};

export const markStorySeen = async (req, res) => {
    try {
        const today = getTodayString();
        const progress = await UserDailyProgress.findOne({ user: req.user._id, date: today });
        if (!progress) return res.status(404).json({ error: 'No progress found for today' });

        progress.storySeen = true;
        await progress.save();
        await checkAndCompleteDay(progress, req.user._id);

        res.json(progress);
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
};