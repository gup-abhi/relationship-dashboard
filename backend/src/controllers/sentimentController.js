import Post from '../models/Post.js';

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