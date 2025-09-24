import express from 'express';
import Post from '../models/Post.js';
const router = express.Router();

// GET /api/demographics/age-ranges
router.get('/age-ranges', async (req, res) => {
  try {
    const ageRanges = await Post.distinct('age_range_op');
    res.json(ageRanges);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET /api/demographics/gender
router.get('/gender', (req, res) => {
  res.json({ message: 'Gender distribution endpoint' });
});

// GET /api/demographics/relationship-stages
router.get('/relationship-stages', async (req, res) => {
  try {
    const stages = await Post.distinct('relationship_stage');
    res.json(stages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET /api/demographics/relationship-length
router.get('/relationship-length', (req, res) => {
  res.json({ message: 'Relationship duration analysis endpoint' });
});

export default router;