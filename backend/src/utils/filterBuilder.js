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
  if (filters.gender_op && filters.gender_op !== 'all') {
    matchStage.gender_op = filters.gender_op;
  }
  if (filters.relationship_length && filters.relationship_length !== 'all') {
    matchStage.relationship_length = filters.relationship_length;
  }

  if (filters.time_period && filters.time_period !== 'all') {
    const now = new Date();
    let startDate;
    switch (filters.time_period) {
      case 'last_24_hours':
        startDate = new Date(now.setDate(now.getDate() - 1));
        break;
      case 'last_7_days':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'last_30_days':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'last_12_months':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = null;
    }
    if (startDate) {
      matchStage.created_date = { $gte: startDate };
    }
  }
  // Add more filter conditions as needed

  return Object.keys(matchStage).length > 0 ? { $match: matchStage } : {};
};

export { buildMatchStage };