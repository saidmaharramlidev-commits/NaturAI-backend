import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import dailyProgressRoutes from './routes/dailyProgressRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import answerRoutes from './routes/answerRoutes.js';
import inboxRoutes from './routes/inboxRoutes.js';
import statsRoutes from './routes/statsRoutes.js';



connectDB();

const app = express();

app.use(cors());
app.use(express.json());


app.use('/api/users', userRoutes);
app.use('/api/daily', dailyProgressRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/answers', answerRoutes);
app.use('/api/inbox', inboxRoutes);
app.use('/api/stats', statsRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'NaturAI app backend is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});