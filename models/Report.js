import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    targetType: {
        type: String,
        enum: ['message', 'answer'],
        required: true,
    },
    targetId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Prevent the same user from reporting the same content more than once
reportSchema.index({ reportedBy: 1, targetType: 1, targetId: 1 }, { unique: true });

const Report = mongoose.model('Report', reportSchema);

export default Report;