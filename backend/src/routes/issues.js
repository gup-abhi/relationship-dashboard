import express from 'express';
const router = express.Router();
import Post from '../models/Post.js';

// GET /api/issues/primary
router.get('/primary', async (req, res) => {
  try {
    const { relationship_stage, age_range_op } = req.query;
    let matchStage = {};

    if (relationship_stage) {
      matchStage.relationship_stage = relationship_stage;
    }
    if (age_range_op) {
      matchStage.age_range_op = age_range_op;
    }

    const primaryIssues = await Post.aggregate([
      { $match: matchStage },
      { $group: { _id: '$issue_category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    res.json(primaryIssues);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET /api/issues/secondary
router.get('/secondary', async (req, res) => {
  try {
    const secondaryIssues = await Post.aggregate([
      { $project: { secondary_issues: { $split: ['$secondary_issues', '; '] } } },
      { $unwind: '$secondary_issues' },
      { $group: { _id: '$secondary_issues', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    res.json(secondaryIssues);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET /api/issues/red-flags
router.get('/red-flags', async (req, res) => {
  try {
    const redFlags = await Post.aggregate([
      { $project: { red_flags_present: { $split: ['$red_flags_present', '; '] } } },
      { $unwind: '$red_flags_present' },
      { $group: { _id: '$red_flags_present', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    res.json(redFlags);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET /api/issues/positive-indicators
router.get('/positive-indicators', async (req, res) => {
  try {
    const positiveIndicators = await Post.aggregate([
      { $project: { positive_indicators: { $split: ['$positive_indicators', '; '] } } },
      { $unwind: '$positive_indicators' },
      { $group: { _id: '$positive_indicators', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
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