const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const pino = require('pino');
const logger = pino();
require('dotenv').config();

const ECO_OPTIONS = [
  { value: '', label: 'None' },
  { value: 'tree_plantation', label: 'Tree plantation' },
  { value: 'recycling', label: 'Recycling' },
  { value: 'cleanup', label: 'Clean-up drive' },
  { value: 'cycling', label: 'Cycling' },
  { value: 'other', label: 'Other eco activity' },
];

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/users');
const challengeRoutes = require('./routes/challenges');
const rewardRoutes = require('./routes/rewards');
const adminRoutes = require('./routes/admin');

const errorHandler = require('./middleware/errorMiddleware');

const app = express();
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/greensphere')
  .then(() => logger.info('MongoDB connected'))
  .catch((err) => logger.error('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.get('/api/config/eco-options', (req, res) => res.json(ECO_OPTIONS));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
