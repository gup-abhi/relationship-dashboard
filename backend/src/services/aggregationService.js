import Post from '../models/Post.js';
import { buildMatchStage } from '../utils/filterBuilder.js';
import { getTimeSeriesAggregation } from '../utils/timeSeriesAggregator.js';

const getPostsCount = async (filters = {}) => {
  try {
    const match = buildMatchStage(filters);
    const count = await Post.countDocuments(match.$match);
    return count;
  } catch (error) {
    throw new Error(`Error fetching posts count: ${error.message}`);
  }
};

const getPostsByField = async (field, filters = {}) => {
  try {
    const match = buildMatchStage(filters);
    const pipeline = [];
    if (Object.keys(match).length > 0) {
      pipeline.push(match);
    }
    pipeline.push(
      {
        $group: {
          _id: `$${field}`,
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    );
    const result = await Post.aggregate(pipeline);
    return result;
  } catch (error) {
    throw new Error(`Error fetching posts by field ${field}: ${error.message}`);
  }
};

const getCrossTabulation = async (field1, field2, filters = {}) => {
  try {
    const match = buildMatchStage(filters);
    const pipeline = [];
    if (Object.keys(match).length > 0) {
      pipeline.push(match);
    }
    pipeline.push(
      {
        $group: {
          _id: { field1: `$${field1}`, field2: `$${field2}` },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          field1: "$_id.field1",
          field2: "$_id.field2",
          count: "$count"
        }
      },
      { $sort: { field1: 1, field2: 1 } }
    );
    const result = await Post.aggregate(pipeline);
    return result;
  } catch (error) {
    throw new Error(`Error fetching cross-tabulation for ${field1} and ${field2}: ${error.message}`);
  }
};

const getMostCommonIssues = async (filters = {}) => {
  try {
    const match = buildMatchStage(filters);
    const pipeline = [];
    if (Object.keys(match).length > 0) {
      pipeline.push(match);
    }
    pipeline.push(
      { $group: { _id: '$issue_category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    );
    const mostCommonIssue = await Post.aggregate(pipeline);
    return mostCommonIssue[0];
  } catch (error) {
    throw new Error(`Error fetching most common issue: ${error.message}`);
  }
};

const getAverageComplexityScore = async (filters = {}) => {
  try {
    const match = buildMatchStage(filters);
    const pipeline = [];
    if (Object.keys(match).length > 0) {
      pipeline.push(match);
    }
    pipeline.push(
      {
        $group: {
          _id: null,
          averageComplexity: { $avg: '$complexity_score' },
        },
      },
    );
    const result = await Post.aggregate(pipeline);
    return result.length > 0 ? result[0].averageComplexity : 0;
  } catch (error) {
    throw new Error(`Error fetching average complexity score: ${error.message}`);
  }
};

const getSentimentDistribution = async (filters = {}) => {
  try {
    return await getPostsByField('post_sentiment', filters);
  } catch (error) {
    throw new Error(`Error fetching sentiment distribution: ${error.message}`);
  }
};

const getMostCommonIssuesDistribution = async (filters = {}) => {
  try {
    const match = buildMatchStage(filters);
    const pipeline = [];
    if (Object.keys(match).length > 0) {
      pipeline.push(match);
    }
    pipeline.push(
      { $group: { _id: '$issue_category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    );
    const mostCommonIssues = await Post.aggregate(pipeline);
    return mostCommonIssues;
  } catch (error) {
    throw new Error(`Error fetching most common issues distribution: ${error.message}`);
  }
};

const getTopIssues = async (limit = 5, filters = {}) => {
  try {
    const match = buildMatchStage(filters);
    const pipeline = [];
    if (Object.keys(match).length > 0) {
      pipeline.push(match);
    }
    pipeline.push(
      { $group: { _id: '$issue_category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit },
    );
    const topIssues = await Post.aggregate(pipeline);
    return topIssues;
  } catch (error) {
    throw new Error(`Error fetching top issues: ${error.message}`);
  }
};

const getRecentTrends = async (timeUnit = 'day', dateField = 'created_date', filters = {}) => {
  try {
    const match = buildMatchStage(filters);
    const timeSeriesPipeline = getTimeSeriesAggregation(timeUnit, dateField);
    const pipeline = [];
    if (Object.keys(match).length > 0) {
      pipeline.push(match);
    }
    pipeline.push(...timeSeriesPipeline);
    const recentTrends = await Post.aggregate(pipeline);
    return recentTrends;
  } catch (error) {
    throw new Error(`Error fetching recent trends: ${error.message}`);
  }
};

export {
  getPostsCount,
  getPostsByField,
  getCrossTabulation,
  getMostCommonIssues,
  getAverageComplexityScore,
  getSentimentDistribution,
  getMostCommonIssuesDistribution,
  getTopIssues,
  getRecentTrends,
};