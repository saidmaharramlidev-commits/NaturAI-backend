import mongoose from 'mongoose';

const userDailyProgressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    date: {
        type: String, // stored as "YYYY-MM-DD" for easy comparison
        required: true,
    },
    assignedQuote: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DailyContent',
    },
    assignedStory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DailyContent',
    },
    quoteSeen: {
        type: Boolean,
        default: false,
    },
    storySeen: {
        type: Boolean,
        default: false,
    },
    roomActivityDone: {
        type: Boolean,
        default: false,
    },
    isDayComplete: {
        type: Boolean,
        default: false,
    },
});

// Prevent duplicate progress docs for the same user on the same day
userDailyProgressSchema.index({ user: 1, date: 1 }, { unique: true });

const UserDailyProgress = mongoose.model('UserDailyProgress', userDailyProgressSchema);

export default UserDailyProgress;