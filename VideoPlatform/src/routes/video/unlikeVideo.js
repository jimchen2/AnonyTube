// src/routes/video/unlikeVideo.js
const express = require("express");
const router = express.Router();
const Video = require("../../models/Videos");
const { authenticate } = require("../../utils/authUtils");

router.post("/:uuid", authenticate, async (req, res) => {
  try {
    const { uuid } = req.params;
    const userUUID = req.userUUID;

    const video = await Video.findOne({ uuid });

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    video.likes = video.likes.filter((likedUserUUID) => likedUserUUID !== userUUID);
    video.likecount = video.likes.length;
    await video.save();

    res.status(200).json({ message: "Video unliked successfully" });
  } catch (error) {
    console.error("Error unliking video:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;