// src/routes/video/createVideo.js
const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const Video = require("../../models/Videos");
const { authenticate } = require("../../utils/authUtils");

router.post("/", authenticate, async (req, res) => {
  try {
    const {
      videourl,
      title,
      duration,
      previewimageurl,
      tags,
      description,
      language,
    } = req.body;
    console.log(req.body)

    if (!videourl || !title || !duration) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Generate a new UUID for the video
    const uuid = uuidv4();

    // Create a new video document
    const video = new Video({
      uuid,
      videourl,
      title,
      duration,
      previewimageurl,
      tags,
      description,
      language,
      uploaderuuid: req.userUUID,
    });

    // console.log(video);
    const savedVideo = await video.save();

    res.status(201).json({ video: savedVideo });
  } catch (error) {
    console.error("Error creating video:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
