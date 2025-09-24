import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  post_id: String,
  title: String,
  subreddit: String,
  post_url: String,
  flair: String,
  created_date: Date,
  relationship_stage: String,
  issue_category: String,
  secondary_issues: String,
  age_range_op: String,
  relationship_length: String,
  post_sentiment: String,
  urgency_level: String,
  gender_op: String,
  seeking_advice_type: String,
  red_flags_present: String,
  positive_indicators: String,
  key_themes: String,
  complexity_score: Number,
  predicted_outcome: String,
  analysis_date: Date,
  processed_timestamp: Date,
  status: String,
});

export default mongoose.model('Post', PostSchema, 'post_data_analytics');