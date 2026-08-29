import mongoose from 'mongoose';

const dailyContentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['quote', 'story'],
        required: true,
    },
    active: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const DailyContent = mongoose.model('DailyContent', dailyContentSchema);

export default DailyContent;