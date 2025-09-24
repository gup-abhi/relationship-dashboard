import express from 'express';
const router = express.Router();
import Post from '../models/Post.js';

// GET /api/overview/kpis
router.get('/kpis', async (req, res) => {
  try {
    const totalPosts = await Post.countDocuments();

    const mostCommonIssue = await Post.aggregate([
      { $group: { _id: '$issue_category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);

    const averageComplexity = await Post.aggregate([
      { $group: { _id: null, avgComplexity: { $avg: '$complexity_score' } } },
    ]);

    const sentimentDistribution = await Post.aggregate([
      { $group: { _id: '$post_sentiment', count: { $sum: 1 } } },
    ]);

    const kpis = {
      totalPosts,
      mostCommonIssue: mostCommonIssue[0],
      averageComplexity: averageComplexity[0].avgComplexity,
      sentimentDistribution,
    };

    res.json(kpis);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET /api/overview/top-issues
router.get('/top-issues', (req, res) => {
  res.json({ message: 'Top issues endpoint' });
});

// GET /api/overview/sentiment
router.get('/sentiment', (req, res) => {
  res.json({ message: 'Sentiment endpoint' });
});

// GET /api/overview/recent-trends
router.get('/recent-trends', (req, res) => {
  res.json({ message: 'Recent trends endpoint' });
});

export default router;