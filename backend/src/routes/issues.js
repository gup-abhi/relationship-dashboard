import express from 'express';
const router = express.Router();
import Post from '../models/Post.js';
import { processMultiValueField } from '../utils/multiValueProcessor.js';
import { buildMatchStage } from '../utils/filterBuilder.js';

// GET /api/issues/primary
router.get('/primary', async (req, res) => {
  try {
    const { relationship_stage, age_range_op } = req.query;
    const match = buildMatchStage({ relationship_stage, age_range_op });

    const pipeline = [];
    if (Object.keys(match).length > 0) {
      pipeline.push(match);
    }
    pipeline.push(
      { $group: { _id: '$issue_category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    );

    const primaryIssues = await Post.aggregate(pipeline);
    res.json(primaryIssues);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET /api/issues/secondary
router.get('/secondary', async (req, res) => {
  try {
    const secondaryIssues = await Post.aggregate(processMultiValueField('secondary_issues'));
    res.json(secondaryIssues);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET /api/issues/red-flags
router.get('/red-flags', async (req, res) => {
  try {
    const redFlags = await Post.aggregate(processMultiValueField('red_flags_present'));
    res.json(redFlags);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET /api/issues/positive-indicators
router.get('/positive-indicators', async (req, res) => {
  try {
    const positiveIndicators = await Post.aggregate(processMultiValueField('positive_indicators'));
    res.json(positiveIndicators);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET /api/issues/themes
router.get('/themes', (req, res) => {
  res.json({ message: 'Key themes analysis endpoint' });
});

// GET /api/issues/complexity
router.get('/complexity', (req, res) => {
  res.json({ message: 'Complexity score distribution endpoint' });
});

export default router;