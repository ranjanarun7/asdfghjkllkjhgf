const mongoose = require("mongoose");

const SafetyFlagsSchema = new mongoose.Schema({
  isSafetyIssue: Boolean,
  isUrgent: Boolean,
  notes: [String]
}, { _id: false });

const AnalysisSchema = new mongoose.Schema({
  detectedLanguage: String,
  sentimentLabel: String,
  sentimentScore: Number,
  ratingInferred: Number,
  categories: [String],
  safetyFlags: SafetyFlagsSchema,
  improvementSuggestionsSystem: [String],
  improvementSuggestionsVendor: [String],
  summaryForDashboard: String,
  shouldRaiseAlert: Boolean,
  alertReason: String,
  analyzedAt: String
}, { _id: false });

const FeedbackSchema = new mongoose.Schema({
  userId: String,
  userName: String,
  targetType: String,
  targetId: String,
  targetName: String,
  rating: Number,
  comment: String,
  createdAt: { type: String, default: () => new Date().toISOString() },
  analysis: AnalysisSchema,
  status: { type: String, default: 'pending' }
});

module.exports= mongoose.model('Feedback', FeedbackSchema);
