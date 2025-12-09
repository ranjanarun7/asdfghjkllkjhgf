const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema({
  detectedLanguage: { type: String, required: true },

  sentimentLabel: { 
    type: String, 
    enum: ["POSITIVE", "NEGATIVE", "NEUTRAL", "MIXED"],
  },

  sentimentScore: { type: Number },

  ratingInferred: { type: Number },

  categories: [{ type: String, required: true }],

  safetyFlags: {
    isSafetyIssue: { type: Boolean, required: true },
    isUrgent: { type: Boolean, required: true },
    notes: [{ type: String, required: true }],
  },

  improvementSuggestionsSystem: [{ type: String }],

  improvementSuggestionsVendor: [{ type: String }],

  summaryForDashboard: { type: String, required: true },

  shouldRaiseAlert: { type: Boolean, required: true },

  alertReason: { type: String }
});

module.exports = mongoose.model("Analysis", analysisSchema);