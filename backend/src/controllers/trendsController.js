import { getRecentTrends, getTrendingTopics } from '../services/aggregationService.js';

export const getPostVolumeTrends = async (req, res) => {
  try {
    const { timeUnit, dateField, ...filters } = req.query;
    const trends = await getRecentTrends(timeUnit, dateField, filters);
    res.json(trends);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

export const getTrendingTopicsOverTime = async (req, res) => {
  try {
    const { timeUnit, dateField, ...filters } = req.query;
    const topics = await getTrendingTopics(timeUnit, dateField, filters);
    res.json(topics);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};