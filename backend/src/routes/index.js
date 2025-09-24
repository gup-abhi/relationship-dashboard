const express = require('express');
const router = express.Router();
const overviewRoutes = require('./overview');
const demographicRoutes = require('./demographics');
const issuesRoutes = require('./issues');
const sentimentRoutes = require('./sentiment');
const trendsRoutes = require('./trends');
const mongoose = require('mongoose');

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

module.exports = router;