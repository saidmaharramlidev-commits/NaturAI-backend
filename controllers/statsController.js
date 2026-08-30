import AppStats from '../models/AppStats.js';

export const getStats = async (req, res) => {
    try {
        let stats = await AppStats.findOne({ key: 'main' });

        // Auto-create the document on first request if it doesn't exist yet
        if (!stats) {
            stats = await AppStats.create({ key: 'main', communityCount: 0 });
        }

        res.json({ communityCount: stats.communityCount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};