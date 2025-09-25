import {
  getPostsCount,
  getMostCommonIssues,
  getAverageComplexityScore,
  getSentimentDistribution,
  getMostCommonIssuesDistribution,
} from '../services/aggregationService.js';

const getTotalPostsCount = async (req, res, next) => {
  try {
    const filters = req.query; // Extract filters from query parameters
    const count = await getPostsCount(filters);
    res.status(200).json({ totalPosts: count });
  } catch (error) {
    next(error);
  }
};

const getMostCommonIssuesController = async (req, res, next) => {
  try {
    const filters = req.query; // Extract filters from query parameters
    const mostCommonIssue = await getMostCommonIssues(filters);
    res.status(200).json({ mostCommonIssue });
  } catch (error) {
    next(error);
  }
};

const getAverageComplexityScoreController = async (req, res, next) => {
  try {
    const filters = req.query; // Extract filters from query parameters
    const averageComplexity = await getAverageComplexityScore(filters);
    res.status(200).json({ averageComplexity });
  } catch (error) {
    next(error);
  }
};

const getSentimentDistributionController = async (req, res, next) => {
  try {
    const filters = req.query; // Extract filters from query parameters
    const sentimentDistribution = await getSentimentDistribution(filters);
    res.status(200).json({ sentimentDistribution });
  } catch (error) {
    next(error);
  }
};

const getMostCommonIssuesDistributionController = async (req, res, next) => {
  try {
    const filters = req.query; // Extract filters from query parameters
    const mostCommonIssuesDistribution = await getMostCommonIssuesDistribution(filters);
    res.status(200).json({ mostCommonIssuesDistribution });
  } catch (error) {
    next(error);
  }
};

export {
  getTotalPostsCount,
  getMostCommonIssuesController,
  getAverageComplexityScoreController,
  getSentimentDistributionController,
  getMostCommonIssuesDistributionController,
};