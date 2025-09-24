import express from 'express';
const router = express.Router();
import overviewRoutes from './overview.js';
import demographicRoutes from './demographics.js';
import issuesRoutes from './issues.js';
import sentimentRoutes from './sentiment.js';
import trendsRoutes from './trends.js';
import mongoose from 'mongoose';

router.use('/overview', overviewRoutes);
router.use('/demographics', demographicRoutes);
router.use('/issues', issuesRoutes);
router.use('/sentiment', sentimentRoutes);
router.use('/trends', trendsRoutes);

router.get('/health', (req, res) => {
    const dbStatus = mongoose.connection.readyState;
    const dbStatusMap = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting',
    };
    res.json({ db: dbStatusMap[dbStatus] });
});

export default router;