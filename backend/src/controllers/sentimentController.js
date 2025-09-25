import Post from '../models/Post.js';
import { getRecentTrends, getCrossTabulation } from '../services/aggregationService.js';

export const getSentimentDistribution = async (req, res) => {
  try {
    const { relationship_stage, age_range_op } = req.query;
    let matchStage = {};

    if (relationship_stage) {
      matchStage.relationship_stage = relationship_stage;
    }
    if (age_range_op) {
      matchStage.age_range_op = age_range_op;
    }

    const sentimentDistribution = await Post.aggregate([
      { $match: matchStage },
      {
        $project: {
          sentiments: { $split: ["$post_sentiment", "|"] }
        }
      },
      { $unwind: "$sentiments" },
      { $group: { _id: '$sentiments', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    res.json(sentimentDistribution);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

export const getSentimentTrends = async (req, res) => {
  try {
    const { timeUnit, dateField, ...filters } = req.query;
    const trends = await getRecentTrends(timeUnit, dateField, filters);
    res.json(trends);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

export const getSentimentByDemographics = async (req, res) => {
  try {
    const { demographicField, ...filters } = req.query;
    if (!demographicField) {
      return res.status(400).json({ message: 'demographicField is required' });
    }
    const data = await getCrossTabulation(demographicField, 'post_sentiment', filters);
    res.json(data);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};