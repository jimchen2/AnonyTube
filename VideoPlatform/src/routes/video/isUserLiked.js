// src/routes/video/isUserLiked.js
const express = require("express");
const router = express.Router();
const Video = require("../../models/Videos");
const { authenticate } = require("../../utils/authUtils");

router.get("/:uuid", authenticate, async (req, res) => {
  try {
    const { uuid } = req.params;
    const userUUID = req.userUUID;

    const video = await Video.findOne({ uuid });

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    const isLiked = video.likes.includes(userUUID);

    res.status(200).json({ isLiked });
  } catch (error) {
    console.error("Error checking if user liked video:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;