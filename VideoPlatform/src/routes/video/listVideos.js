// src/routes/video/listVideos.js
const express = require("express");
const router = express.Router();
const Video = require("../../models/Videos");

router.get("/", async (req, res) => {
  try {
    const videos = await Video.find();

    res.status(200).json({ videos });
  } catch (error) {
    console.error("Error listing videos:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;