// src/models/Video.js
const mongoose = require("mongoose");

const VideoSchema = new mongoose.Schema(
  {
    uuid: { type: String, required: true, unique: true },
    previewimageurl: { type: String },
    videourl: [
      {
        quality: String,
        url: String,
        _id: false,
      },
    ],
    subtitles: [
      {
        language: String,
        url: String,
      },
    ],
    language: { type: String, default: "en" },
    title: { type: String, required: true },
    uploaderuuid: { type: String, required: true },
    likes: [String],
    likecount: {
      type: Number,
      default: 0,
    },
    views: [
      {
        useruuid: String,
        dates: [Date],
      },
    ],
    viewscount: {
      type: Number,
      default: 0,
    },
    tags: [String],
    description: { type: String, default: null }, // Explicitly set to null by default
    duration: Number,
    flagged: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Video = mongoose.model("Video", VideoSchema);

module.exports = Video;
