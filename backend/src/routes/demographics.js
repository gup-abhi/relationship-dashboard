import express from 'express';
import Post from '../models/Post.js';
import { getPostsByField, getCrossTabulation } from '../services/aggregationService.js';
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
router.get('/relationship-stages', async (req, res, next) => {
  try {
    const filters = req.query;
    const relationshipStagesDistribution = await getPostsByField('relationship_stage', filters);
    res.status(200).json({ relationshipStagesDistribution });
  } catch (err) {
    next(err);
  }
});

// GET /api/demographics/relationship-length
router.get('/relationship-length', async (req, res, next) => {
  try {
    const filters = req.query;
    const relationshipLengthDistribution = await getPostsByField('relationship_length', filters);
    res.status(200).json({ relationshipLengthDistribution });
  } catch (err) {
    next(err);
  }
});

// GET /api/demographics/cross-tabulation
router.get('/cross-tabulation', async (req, res, next) => {
  try {
    const { field1, field2, ...filters } = req.query;
    if (!field1 || !field2) {
      return res.status(400).json({ message: 'Both field1 and field2 are required for cross-tabulation.' });
    }
    const crossTabulation = await getCrossTabulation(field1, field2, filters);
    res.status(200).json({ crossTabulation });
  } catch (err) {
    next(err);
  }
});

export default router;