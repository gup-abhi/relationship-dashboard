import express from 'express';
const router = express.Router();
import { getSentimentDistribution, getSentimentTrends } from '../controllers/sentimentController.js';

// GET /api/sentiment/distribution
router.get('/distribution', getSentimentDistribution);

// GET /api/sentiment/trends
router.get('/trends', getSentimentTrends);

// GET /api/sentiment/by-demographics
router.get('/by-demographics', (req, res) => {
  res.json({ message: 'Sentiment by demographic segments endpoint' });
});

// GET /api/sentiment/urgency
router.get('/urgency', (req, res) => {
  res.json({ message: 'Urgency level analysis endpoint' });
});

export default router;