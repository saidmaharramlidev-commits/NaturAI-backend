import Report from '../models/Report.js';
import RoomMessage from '../models/RoomMessage.js';
import Answer from '../models/Answer.js';
import InboxItem from '../models/InboxItem.js';


const THRESHOLDS = {
    message: 3, // visible to everyone — needs multiple distinct reporters
    answer: 1,  // only the asker ever sees it — one report is enough
};

export const createReport = async (req, res) => {
    try {
        const { targetType, targetId } = req.body;
        const userId = req.user._id;

        if (!['message', 'answer'].includes(targetType)) {
            return res.status(400).json({ error: 'Invalid report target type' });
        }

        if (!targetId) {
            return res.status(400).json({ error: 'targetId is required' });
        }

        // This will throw if the same user already reported this exact content
        // (enforced by the unique index from Step 1)
        try {
            await Report.create({ reportedBy: userId, targetType, targetId });
        } catch (err) {
            if (err.code === 11000) {
                return res.status(409).json({ error: 'You already reported this' });
            }
            throw err;
        }

        const reportCount = await Report.countDocuments({ targetType, targetId });
        const threshold = THRESHOLDS[targetType];

        if (reportCount >= threshold) {
            if (targetType === 'message') {
                await RoomMessage.findByIdAndUpdate(targetId, { hidden: true });
            } else {
                await Answer.findByIdAndUpdate(targetId, { hidden: true });
                // Sync the hide onto the matching embedded copy in the asker's Inbox
                await InboxItem.updateOne(
                    { 'answers.answerRef': targetId },
                    { $set: { 'answers.$.hidden': true } }
                );
            }
        }

        res.status(201).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};