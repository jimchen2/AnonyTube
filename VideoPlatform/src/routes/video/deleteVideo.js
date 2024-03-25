// src/routes/video/deleteVideo.js
const express = require("express");
const router = express.Router();
const Video = require("../../models/Videos");
const { authenticate } = require("../../utils/authUtils");

router.delete("/:uuid", authenticate, async (req, res) => {
  try {
    const { uuid } = req.params;
    const userUUID = req.userUUID;

    const video = await Video.findOne({ uuid });

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    if (video.uploaderuuid !== userUUID) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this video" });
    }

    await Video.deleteOne({ uuid });

    res.status(200).json({ message: "Video deleted successfully" });
  } catch (error) {
    console.error("Error deleting video:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
