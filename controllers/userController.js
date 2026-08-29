import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '365d' });
};

export const createUser = async (req, res) => {
    try {
        const { username } = req.body;

        if (!username || username.trim().length < 3) {
            return res.status(400).json({ error: 'Username must be at least 3 characters' });
        }

        const existing = await User.findOne({ username: username.trim() });
        if (existing) {
            return res.status(409).json({ error: 'Username already taken' });
        }

        const user = await User.create({ username: username.trim() });
        const token = generateToken(user._id);

        res.status(201).json({
            token,
            username: user.username,
            streak: user.streak,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

export const updateUsername = async (req, res) => {
    try {
        const { username } = req.body;
        const userId = req.user._id;

        if (!username || username.trim().length < 3) {
            return res.status(400).json({ error: 'Username must be at least 3 characters' });
        }

        const trimmed = username.trim();

        const existing = await User.findOne({ username: trimmed, _id: { $ne: userId } });
        if (existing) {
            return res.status(409).json({ error: 'Username already taken' });
        }

        const user = await User.findById(userId);
        user.username = trimmed;
        await user.save();

        res.json({ username: user.username });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};