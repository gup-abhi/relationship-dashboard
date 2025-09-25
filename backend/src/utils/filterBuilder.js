const buildMatchStage = (filters) => {
  const matchStage = {};

  if (filters.relationship_stage && filters.relationship_stage !== 'all') {
    matchStage.relationship_stage = filters.relationship_stage;
  }
  if (filters.age_range_op && filters.age_range_op !== 'all') {
    matchStage.age_range_op = filters.age_range_op;
  }
  if (filters.post_sentiment && filters.post_sentiment !== 'all') {
    matchStage.post_sentiment = filters.post_sentiment;
  }
  // Add more filter conditions as needed

  return Object.keys(matchStage).length > 0 ? { $match: matchStage } : {};
};

export { buildMatchStage };