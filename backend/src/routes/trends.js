import express from 'express';
const router = express.Router();
import { getPostVolumeTrends } from '../controllers/trendsController.js';

// GET /api/trends/volume
router.get('/volume', getPostVolumeTrends);

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