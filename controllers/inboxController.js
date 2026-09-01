import InboxItem from '../models/InboxItem.js';


export const getInbox = async (req, res) => {
    try {
        const userId = req.user._id;
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        await InboxItem.deleteMany({
            askedBy: userId,
            isLiked: false,
            createdAt: { $lt: startOfToday },
        });

        const items = await InboxItem.find({ askedBy: userId })
            .sort({ createdAt: -1 })
            .populate('answers.answeredBy', 'username');

        // Strip hidden answers before sending to the client
        const filtered = items.map((item) => ({
            ...item.toObject(),
            answers: item.answers.filter((a) => !a.hidden),
        }));

        res.json(filtered);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

export const likeInboxItem = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const item = await InboxItem.findOne({ _id: id, askedBy: userId });

        if (!item) {
            return res.status(404).json({ error: 'Inbox item not found' });
        }

        item.isLiked = true;
        await item.save();

        res.json(item);
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
};