/**
 * @typedef {'poi'|'vendor'|'itinerary'|'assistant'|'other'} TargetType
 */

/**
 * @typedef {'POSITIVE'|'NEGATIVE'|'NEUTRAL'|'MIXED'} SentimentLabel
 */

/**
 * @typedef {Object} SafetyFlags
 * @property {boolean} isSafetyIssue
 * @property {boolean} isUrgent
 * @property {string[]} notes
 */

/**
 * @typedef {Object} AnalysisResult
 * @property {string} detectedLanguage
 * @property {SentimentLabel} sentimentLabel
 * @property {number} sentimentScore
 * @property {number|null} ratingInferred
 * @property {string[]} categories
 * @property {SafetyFlags} safetyFlags
 * @property {string[]} improvementSuggestionsSystem
 * @property {string[]} improvementSuggestionsVendor
 * @property {string} summaryForDashboard
 * @property {boolean} shouldRaiseAlert
 * @property {string} alertReason
 * @property {string} analyzedAt
 */

/**
 * @typedef {Object} Feedback
 * @property {string} id
 * @property {string=} userId
 * @property {TargetType} targetType
 * @property {string} targetId
 * @property {string} targetName
 * @property {number=} rating
 * @property {string} comment
 * @property {string} createdAt
 * @property {AnalysisResult|null} analysis
 * @property {'pending'|'analyzed'|'failed'} status
 */

/**
 * @typedef {Object} DashboardMetrics
 * @property {number} totalFeedback
 * @property {number} pendingAnalysis
 * @property {Object.<SentimentLabel, number>} sentimentBreakdown
 * @property {number} totalAlerts
 * @property {number} urgentSafetyIssues
 */


/* OPTIONAL ENUM CONSTANTS (for safer usage in JS) */

export const TARGET_TYPES = {
  POI: 'poi',
  VENDOR: 'vendor',
  ITINERARY: 'itinerary',
  ASSISTANT: 'assistant',
  OTHER: 'other'
};

export const SENTIMENT_LABELS = {
  POSITIVE: 'POSITIVE',
  NEGATIVE: 'NEGATIVE',
  NEUTRAL: 'NEUTRAL',
  MIXED: 'MIXED'
};
