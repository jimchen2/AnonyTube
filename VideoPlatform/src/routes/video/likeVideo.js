// src/routes/video/likeVideo.js
const express = require("express");
const router = express.Router();
const Video = require("../../models/Videos");
const { authenticate } = require("../../utils/authUtils");

router.post("/:uuid", authenticate, async (req, res) => {
  try {
    const { uuid } = req.params;
    const userUUID = req.userUUID;
    // console.log(req.userUUID);
    const video = await Video.findOne({ uuid });

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    if (!video.likes.includes(userUUID)) {
      video.likes.push(userUUID);
      video.likecount = video.likes.length;
      await video.save();
    }

    res.status(200).json({ message: "Video liked successfully" });
  } catch (error) {
    console.error("Error liking video:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
