const express = require('express');
const router = express.Router();

// GET /api/overview/kpis
router.get('/kpis', (req, res) => {
  const kpis = {
    totalPosts: 1234,
    mostCommonIssue: 'Communication',
    averageComplexity: 6.7,
    sentimentDistribution: {
      positive: 25,
      negative: 45,
      neutral: 30,
    },
  };
  res.json(kpis);
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

module.exports = router;