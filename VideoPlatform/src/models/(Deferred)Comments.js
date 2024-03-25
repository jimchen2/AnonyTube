const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
    videoUuid: { type: String, required: true, ref: 'Video' }, // Reference to the Video
    useruuid: { type: String, required: true, ref: 'User' }, // Reference to the User who made the comment
    text: { type: String, required: true },
    likes: { type: Number, default: 0 },
    parentCommentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null }, // Self-reference for nesting
    date: { type: Date, default: Date.now }
}, { timestamps: true });

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;
