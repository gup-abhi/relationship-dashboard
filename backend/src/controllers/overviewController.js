import { getPostsCount, getMostCommonIssues } from '../services/aggregationService.js';

const getTotalPostsCount = async (req, res, next) => {
  try {
    const count = await getPostsCount();
    res.status(200).json({ totalPosts: count });
  } catch (error) {
    next(error);
  }
};

const getMostCommonIssuesController = async (req, res, next) => {
  try {
    const mostCommonIssue = await getMostCommonIssues();
    res.status(200).json({ mostCommonIssue });
  } catch (error) {
    next(error);
  }
};

export { getTotalPostsCount, getMostCommonIssuesController };