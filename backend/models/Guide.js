const mongoose = require("mongoose");

const GuideSchema = new mongoose.Schema({
  userId: String,
  name: String,
  region: String,
  language: String,
  document: String,
  status: String,
});

module.exports = mongoose.model("Guide", GuideSchema);
