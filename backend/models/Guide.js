const mongoose = require("mongoose");

const GuideSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: String,
    region: String,
    language: String,
    document: String,

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    documentVerified: { type: Boolean, default: false },
    interviewScheduled: { type: Boolean, default: false },
    interviewCenter: String,
    interviewDate: Date,
    interviewCleared: { type: Boolean, default: false },
    agreementSigned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Guide", GuideSchema);
