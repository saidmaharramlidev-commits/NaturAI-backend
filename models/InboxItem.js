import mongoose from 'mongoose';

const inboxAnswerSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    answeredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const inboxItemSchema = new mongoose.Schema({
    originalQuestion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RoomMessage',
        required: true,
    },
    questionText: {
        type: String,
        required: true,
    },
    askedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    answers: [inboxAnswerSchema],
    isLiked: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const InboxItem = mongoose.model('InboxItem', inboxItemSchema);

export default InboxItem;