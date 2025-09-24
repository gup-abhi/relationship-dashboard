import express from 'express';
const router = express.Router();
import Post from '../models/Post.js';

// GET /api/sentiment/distribution
router.get('/distribution', async (req, res) => {
  try {
    const { relationship_stage, age_range_op } = req.query;
    let matchStage = {};

    if (relationship_stage) {
      matchStage.relationship_stage = relationship_stage;
    }
    if (age_range_op) {
      matchStage.age_range_op = age_range_op;
    }

    const sentimentDistribution = await Post.aggregate([
      { $match: matchStage },
      { $group: { _id: '$post_sentiment', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    res.json(sentimentDistribution);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET /api/sentiment/trends
router.get('/trends', (req, res) => {
  res.json({ message: 'Sentiment trends over time endpoint' });
});

// GET /api/sentiment/by-demographics
router.get('/by-demographics', (req, res) => {
  res.json({ message: 'Sentiment by demographic segments endpoint' });
});

// GET /api/sentiment/urgency
router.get('/urgency', (req, res) => {
  res.json({ message: 'Urgency level analysis endpoint' });
});

export default router;