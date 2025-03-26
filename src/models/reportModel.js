const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  id: {
    type: String,
    default: () => new mongoose.Types.UUID(),
    unique: true,
  },
  userId: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
    trim: true,
  },
  performanceScore: {
    type: Number,
    default: 0,
  },
  seoScore: {
    type: Number,
    default: 0,
  },
  accessibilityScore: {
    type: Number,
    default: 0,
  },
  bestPracticesScore: {
    type: Number,
    default: 0,
  },
  recommendations: {
    type: mongoose.Schema.Types.Mixed, // Allows storing JSON data
    required: true,
  },
}, { timestamps: true });

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;
