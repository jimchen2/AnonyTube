// src/routes/video/getVideo.js
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

    res.status(200).json(video);
  } catch (error) {
    console.error("Error retrieving video:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
