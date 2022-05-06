const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    // User Profile Data Schema
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    url: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("profiles", profileSchema);
