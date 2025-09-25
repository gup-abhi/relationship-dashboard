import { getRecentTrends, getTrendingTopics as getTopics } from '../services/aggregationService.js';

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

export const getTrendingTopics = async (req, res) => {
  try {
    const topics = await getTopics(req.query);
    res.json(topics);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};