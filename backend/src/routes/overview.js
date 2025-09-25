import express from 'express';
import Post from '../models/Post.js';
import { getPostsCount, getMostCommonIssues } from '../services/aggregationService.js';
import { getTotalPostsCount, getMostCommonIssuesController } from '../controllers/overviewController.js';

const router = express.Router();

// GET /api/overview/total-posts
router.get('/total-posts', getTotalPostsCount);

// GET /api/overview/most-common-issues
router.get('/most-common-issues', getMostCommonIssuesController);

// GET /api/overview/kpis
router.get('/kpis', async (req, res, next) => {
  try {
    const totalPosts = await getPostsCount();
    const mostCommonIssue = await getMostCommonIssues();

    const averageComplexity = await Post.aggregate([
      { $group: { _id: null, avgComplexity: { $avg: '$complexity_score' } } },
    ]);

    const sentimentDistribution = await Post.aggregate([
      { $group: { _id: '$post_sentiment', count: { $sum: 1 } } },
    ]);

    const kpis = {
      totalPosts,
      mostCommonIssue: mostCommonIssue,
      averageComplexity: averageComplexity[0].avgComplexity,
      sentimentDistribution,
    };

    res.json(kpis);
  } catch (err) {
    next(err);
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