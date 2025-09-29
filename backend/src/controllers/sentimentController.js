import { getSentimentTrendsOverTime, getCrossTabulation, getPostsByField, getSentimentDistribution as getSentimentDistributionService } from '../services/aggregationService.js';

export const getSentimentDistribution = async (req, res) => {
  try {
    const filters = req.query;
    const sentimentDistribution = await getSentimentDistributionService(filters);
    res.json(sentimentDistribution);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

export const getSentimentTrends = async (req, res) => {
  try {
    const { timeUnit, dateField, ...filters } = req.query;
    const trends = await getSentimentTrendsOverTime(timeUnit, dateField, filters);
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

export const getUrgencyLevelDistribution = async (req, res) => {
  try {
    const filters = req.query;
    const data = await getPostsByField('urgency_level', filters);
    res.json(data);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};