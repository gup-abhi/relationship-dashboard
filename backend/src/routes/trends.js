import express from 'express';
const router = express.Router();
import Post from '../models/Post.js';

// GET /api/trends/volume
router.get('/volume', async (req, res) => {
  try {
    const { relationship_stage, age_range_op } = req.query;
    let matchStage = {};

    if (relationship_stage) {
      matchStage.relationship_stage = relationship_stage;
    }
    if (age_range_op) {
      matchStage.age_range_op = age_range_op;
    }

    const postVolume = await Post.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$created_date' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    res.json(postVolume);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET /api/trends/seasonal
router.get('/seasonal', (req, res) => {
  res.json({ message: 'Seasonal patterns endpoint' });
});

// GET /api/trends/topics
router.get('/topics', (req, res) => {
  res.json({ message: 'Trending topics endpoint' });
});

// GET /api/trends/predictions
router.get('/predictions', (req, res) => {
  res.json({ message: 'Predictive analytics endpoint' });
});

export default router;