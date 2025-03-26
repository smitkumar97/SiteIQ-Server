const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    default: () => new mongoose.Types.UUID(), // Generates a UUID
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  subscriptionPlan: {
    type: String,
    enum: ["free", "premium", "enterprise"],
    default: "free",
  },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;
