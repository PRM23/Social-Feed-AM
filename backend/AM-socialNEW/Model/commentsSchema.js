const mongoose = require("mongoose");

const schema = mongoose.Schema;

const commentSchema = new mongoose.Schema(
  {
    // User comments Data Schema
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "posts" },
    comment: { type: String },
    pic: { type: String },
    name: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("comments", commentSchema);
