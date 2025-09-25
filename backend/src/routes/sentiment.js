import express from 'express';
const router = express.Router();
import { getSentimentDistribution, getSentimentTrends, getSentimentByDemographics } from '../controllers/sentimentController.js';

// GET /api/sentiment/distribution
router.get('/distribution', getSentimentDistribution);

// GET /api/sentiment/trends
router.get('/trends', getSentimentTrends);

// GET /api/sentiment/by-demographics
router.get('/by-demographics', getSentimentByDemographics);

// GET /api/sentiment/urgency
router.get('/urgency', (req, res) => {
  res.json({ message: 'Urgency level analysis endpoint' });
});

export default router;