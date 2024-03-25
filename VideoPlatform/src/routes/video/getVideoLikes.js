// src/routes/video/getVideoLikes.js
const express = require("express");
const router = express.Router();
const Video = require("../../models/Videos");

router.get("/:uuid", async (req, res) => {
  try {
    const { uuid } = req.params;

    const video = await Video.findOne({ uuid });

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    res.status(200).json({ likes: video.likes, likecount: video.likecount });
  } catch (error) {
    console.error("Error getting video likes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;