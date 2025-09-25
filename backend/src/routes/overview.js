import express from 'express';
import Post from '../models/Post.js';
import {
  getPostsCount,
  getMostCommonIssues,
  getAverageComplexityScore,
  getSentimentDistribution,
  getMostCommonIssuesDistribution,
} from '../services/aggregationService.js';
import {
  getTotalPostsCount,
  getMostCommonIssuesController,
  getAverageComplexityScoreController,
  getSentimentDistributionController,
  getMostCommonIssuesDistributionController,
} from '../controllers/overviewController.js';

const router = express.Router();

// GET /api/overview/total-posts
router.get('/total-posts', getTotalPostsCount);

// GET /api/overview/most-common-issues
router.get('/most-common-issues', getMostCommonIssuesController);

// GET /api/overview/average-complexity
router.get('/average-complexity', getAverageComplexityScoreController);

// GET /api/overview/sentiment-distribution
router.get('/sentiment-distribution', getSentimentDistributionController);

// GET /api/overview/most-common-issues-distribution
router.get('/most-common-issues-distribution', getMostCommonIssuesDistributionController);

// GET /api/overview/kpis
router.get('/kpis', async (req, res, next) => {
  try {
    const filters = req.query; // Extract filters from query parameters
    const totalPosts = await getPostsCount(filters);
    const mostCommonIssue = await getMostCommonIssues(filters);
    const averageComplexity = await getAverageComplexityScore(filters);
    const sentimentDistribution = await getSentimentDistribution(filters);
    const mostCommonIssuesDistribution = await getMostCommonIssuesDistribution(filters);

    const kpis = {
      totalPosts,
      mostCommonIssue: mostCommonIssue,
      averageComplexity,
      sentimentDistribution,
      mostCommonIssuesDistribution,
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