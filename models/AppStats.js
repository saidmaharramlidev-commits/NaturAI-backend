import mongoose from 'mongoose';

const appStatsSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true,
        default: 'main', // only one document will ever exist, this is its fixed identifier
    },
    communityCount: {
        type: Number,
        required: true,
        default: 0,
    },
});

const AppStats = mongoose.model('AppStats', appStatsSchema);

export default AppStats;