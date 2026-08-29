import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const moderateText = async (req, res, next) => {
    try {
        const { text } = req.body;

        if (!text || !text.trim().length) {
            return res.status(400).json({ error: 'Text is required' });
        }

        const result = await openai.moderations.create({
            model: 'omni-moderation-latest',
            input: text,
        });

        const flagged = result.results[0].flagged;

        if (flagged) {
            return res.status(400).json({ error: 'This message was not allowed. Please rephrase it.' });
        }

        next();
    } catch (error) {
        console.error('Moderation check failed:', error);
        res.status(500).json({ error: 'Could not verify message content, please try again' });
    }
};