import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RoomMessage',
        required: true,
    },
    text: {
        type: String,
        required: true,
        maxlength: 500,
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
    hidden: {
        type: Boolean,
        default: false,
    },
});

const Answer = mongoose.model('Answer', answerSchema);

export default Answer;