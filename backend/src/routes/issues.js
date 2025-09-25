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
      { $match: { issue_category: { $exists: true, $ne: null, $ne: "" } } },
      { $addFields: { issue_categories_array: { $split: ["$issue_category", "|"] } } },
      { $unwind: "$issue_categories_array" },
      { $addFields: { issue_categories_array: { $trim: { input: "$issue_categories_array" } } } }, // Trim whitespace
      { $match: { issue_categories_array: { $ne: "" } } }, // Filter out empty strings after trim
      { $group: { _id: '$issue_categories_array', count: { $sum: 1 } } },
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
    const { relationship_stage, age_range_op } = req.query;
    const match = buildMatchStage({ relationship_stage, age_range_op });

    const pipeline = [];
    if (Object.keys(match).length > 0) {
      pipeline.push(match);
    }
    pipeline.push(
      ...processMultiValueField('secondary_issues')
    );
    const secondaryIssues = await Post.aggregate(pipeline);
    res.json(secondaryIssues);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET /api/issues/red-flags
router.get('/red-flags', async (req, res) => {
  try {
    const { relationship_stage, age_range_op } = req.query;
    const match = buildMatchStage({ relationship_stage, age_range_op });

    const pipeline = [];
    if (Object.keys(match).length > 0) {
      pipeline.push(match);
    }
    pipeline.push(
      ...processMultiValueField('red_flags_present', ';'),
      { $limit: 10 }
    );
    const redFlags = await Post.aggregate(pipeline);
    res.json(redFlags);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET /api/issues/positive-indicators
router.get('/positive-indicators', async (req, res) => {
  try {
    const { relationship_stage, age_range_op } = req.query;
    const match = buildMatchStage({ relationship_stage, age_range_op });

    const pipeline = [];
    if (Object.keys(match).length > 0) {
      pipeline.push(match);
    }
    pipeline.push(
      ...processMultiValueField('positive_indicators', ';'),
      { $limit: 10 }
    );
    const positiveIndicators = await Post.aggregate(pipeline);
    res.json(positiveIndicators);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET /api/issues/themes
router.get('/themes', async (req, res) => {
  try {
    const { relationship_stage, age_range_op } = req.query;
    const match = buildMatchStage({ relationship_stage, age_range_op });

    const pipeline = [];
    if (Object.keys(match).length > 0) {
      pipeline.push(match);
    }

    pipeline.push(
      { $match: { issue_category: { $exists: true, $ne: null, $ne: "" } } },
      { $addFields: { issue_categories_array: { $split: ["$issue_category", "|"] } } },
      { $unwind: "$issue_categories_array" },
      { $addFields: { issue_categories_array: { $trim: { input: "$issue_categories_array" } } } }, // Trim whitespace
      { $match: { issue_categories_array: { $ne: "" } } }, // Filter out empty strings after trim
      { $group: { _id: '$issue_categories_array', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    );

    const keyThemes = await Post.aggregate(pipeline);
    res.json(keyThemes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET /api/issues/complexity
router.get('/complexity', (req, res) => {
  res.json({ message: 'Complexity score distribution endpoint' });
});

export default router;