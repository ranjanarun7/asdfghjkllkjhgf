const mongoose = require("mongoose");

const ItinerarySchema = new mongoose.Schema({
  userId: {
    type:String,
    ref: "User",
    required: true
  },

  title: { type: String, required: true },
  startDate: { type: String, required: true },
  days: { type: Number, required: true },

  cities: { type: [String], default: [] },

  status: { type: String, default: "completed" },

  thumbnail: { type: String, default: "" },

  full_itinerary: {
    type: Object,
    required: true
  }

}, { timestamps: true });

module.exports = mongoose.model("Itinerary", ItinerarySchema);
