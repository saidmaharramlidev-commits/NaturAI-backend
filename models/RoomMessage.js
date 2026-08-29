import mongoose from 'mongoose';

const roomMessageSchema = new mongoose.Schema({
    room: {
        type: String,
        enum: ['personal', 'job', 'relationships', 'general'],
        required: true,
    },
    text: {
        type: String,
        required: true,
        maxlength: 500,
    },
    type: {
        type: String,
        enum: ['question', 'general'],
        required: true,
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    answerCount: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const RoomMessage = mongoose.model('RoomMessage', roomMessageSchema);

export default RoomMessage;