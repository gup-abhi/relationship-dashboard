import Post from '../models/Post.js';

const getPostsCount = async () => {
  try {
    const count = await Post.countDocuments();
    return count;
  } catch (error) {
    throw new Error(`Error fetching posts count: ${error.message}`);
  }
};

const getPostsByField = async (field) => {
  try {
    const result = await Post.aggregate([
      {
        $group: {
          _id: `$${field}`,
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);
    return result;
  } catch (error) {
    throw new Error(`Error fetching posts by field ${field}: ${error.message}`);
  }
};

const getMostCommonIssues = async () => {
  try {
    const mostCommonIssue = await Post.aggregate([
      { $group: { _id: '$issue_category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);
    return mostCommonIssue[0];
  } catch (error) {
    throw new Error(`Error fetching most common issue: ${error.message}`);
  }
};

export { getPostsCount, getPostsByField, getMostCommonIssues };