const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    // User post Data Schema
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    url: { type: String },
    likes: { type: Array },
    caption: { type: String },
    pic: { type: String },
    postedBy: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("posts", postSchema);
