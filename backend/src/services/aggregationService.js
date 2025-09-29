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

    if (field2 === 'post_sentiment') {
      pipeline.push(
        {
          $project: {
            field1: `$${field1}`,
            sentiments: { $split: ["$post_sentiment", "|"] }
          }
        },
        { $unwind: "$sentiments" },
        {
          $group: {
            _id: { field1: "$field1", field2: "$sentiments" },
            count: { $sum: 1 }
          }
        }
      );
    } else {
      pipeline.push(
        {
          $group: {
            _id: { field1: `$${field1}`, field2: `$${field2}` },
            count: { $sum: 1 }
          }
        }
      );
    }

    pipeline.push(
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
    const match = buildMatchStage(filters);
    const pipeline = [];
    if (Object.keys(match).length > 0) {
      pipeline.push(match);
    }
    pipeline.push(
      {
        $project: {
          sentiments: { $split: ["$post_sentiment", "|"] }
        }
      },
      { $unwind: "$sentiments" },
      {
        $group: {
          _id: { $trim: { input: "$sentiments" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    );
    const result = await Post.aggregate(pipeline);
    return result;
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

const getSentimentTrendsOverTime = async (timeUnit = 'day', dateField = 'created_date', filters = {}) => {
  try {
    const match = buildMatchStage(filters);

    // 1. Get top 5 sentiments
    const topSentiments = await getSentimentDistribution(filters);
    const top5Sentiments = topSentiments.slice(0, 5).map(s => s._id);

    const pipeline = [];
    if (Object.keys(match).length > 0) {
      pipeline.push(match);
    }

    // 2. Unwind sentiments and filter by top 5
    pipeline.push(
      {
        $project: {
          date: `$${dateField}`,
          sentiments: { $split: ['$post_sentiment', '|'] }
        }
      },
      { $unwind: '$sentiments' },
      {
        $project: {
          date: 1,
          sentiment: { $trim: { input: '$sentiments' } }
        }
      },
      {
        $match: {
          sentiment: { $in: top5Sentiments }
        }
      }
    );

    // 3. Group by time unit and sentiment
    const groupStage = {
      $group: {
        _id: {
          date: { $dateToString: { format: '%Y-%m', date: '$date' } },
          sentiment: '$sentiment'
        },
        count: { $sum: 1 }
      }
    };

    // 4. Pivot data
    const pivotStage = {
      $group: {
        _id: '$_id.date',
        sentiments: {
          $push: {
            k: '$_id.sentiment',
            v: '$count'
          }
        }
      }
    };

    const projectStage = {
      $project: {
        _id: 0,
        date: '$_id',
        ...top5Sentiments.reduce((acc, sentiment) => {
          acc[sentiment] = {
            $ifNull: [
              {
                $reduce: {
                  input: '$sentiments',
                  initialValue: null,
                  in: {
                    $cond: {
                      if: { $eq: ['$$this.k', sentiment] },
                      then: '$$this.v',
                      else: '$$value'
                    }
                  }
                }
              },
              0
            ]
          };
          return acc;
        }, {})
      }
    };

    pipeline.push(groupStage, pivotStage, projectStage, { $sort: { date: 1 } });

    const trends = await Post.aggregate(pipeline);
    return trends;
  } catch (error) {
    throw new Error(`Error fetching sentiment trends over time: ${error.message}`);
  }
};

const getPostsBySubredditOverTime = async (timeUnit = 'day', dateField = 'created_date', filters = {}) => {
  try {
    const match = buildMatchStage(filters);

    // 1. Get top 5 subreddits
    const topSubreddits = await getPostsByField('subreddit', filters);
    const top5Subreddits = topSubreddits.slice(0, 5).map(s => s._id);

    const pipeline = [];
    if (Object.keys(match).length > 0) {
      pipeline.push(match);
    }

    // 2. Filter by top 5 subreddits
    pipeline.push({
      $match: {
        subreddit: { $in: top5Subreddits }
      }
    });

    // 3. Group by time unit and subreddit
    const groupStage = {
      $group: {
        _id: {
          date: { $dateToString: { format: '%Y-%m', date: `$${dateField}` } },
          subreddit: '$subreddit'
        },
        count: { $sum: 1 }
      }
    };

    // 4. Pivot data
    const pivotStage = {
      $group: {
        _id: '$_id.date',
        subreddits: {
          $push: {
            k: '$_id.subreddit',
            v: '$count'
          }
        }
      }
    };

    const projectStage = {
      $project: {
        _id: 0,
        date: '$_id',
        ...top5Subreddits.reduce((acc, subreddit) => {
          acc[subreddit] = {
            $ifNull: [
              {
                $reduce: {
                  input: '$subreddits',
                  initialValue: null,
                  in: {
                    $cond: {
                      if: { $eq: ['$$this.k', subreddit] },
                      then: '$$this.v',
                      else: '$$value'
                    }
                  }
                }
              },
              0
            ]
          };
          return acc;
        }, {})
      }
    };

    pipeline.push(groupStage, pivotStage, projectStage, { $sort: { date: 1 } });

    const trends = await Post.aggregate(pipeline);
    return trends;
  } catch (error) {
    throw new Error(`Error fetching posts by subreddit over time: ${error.message}`);
  }
};

const getTrendingTopics = async (filters = {}) => {
  try {
    const match = buildMatchStage(filters);
    const pipeline = [];
    if (Object.keys(match).length > 0) {
      pipeline.push(match);
    }
    pipeline.push(
      {
        $project: {
          themes: { $split: ["$key_themes", ";"] }
        }
      },
      { $unwind: "$themes" },
      {
        $group: {
          _id: { $trim: { input: "$themes" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    );
    const result = await Post.aggregate(pipeline);
    return result;
  } catch (error) {
    throw new Error(`Error fetching trending topics: ${error.message}`);
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
  getSentimentTrendsOverTime,
  getPostsBySubredditOverTime,
  getTrendingTopics,
};