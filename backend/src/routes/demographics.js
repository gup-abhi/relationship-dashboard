import express from 'express';
import Post from '../models/Post.js';
import { getPostsByField } from '../services/aggregationService.js';
const router = express.Router();

// GET /api/demographics/age-ranges
router.get('/age-ranges', async (req, res, next) => {
  try {
    const filters = req.query;
    const ageDistribution = await getPostsByField('age_range_op', filters);
    res.status(200).json({ ageDistribution });
  } catch (err) {
    next(err);
  }
});

// GET /api/demographics/gender
router.get('/gender', async (req, res, next) => {
  try {
    const filters = req.query;
    const genderDistribution = await getPostsByField('gender_op', filters);
    res.status(200).json({ genderDistribution });
  } catch (err) {
    next(err);
  }
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