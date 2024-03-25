// src/routes/video/updateVideo.js
const express = require("express");
const router = express.Router();
const Video = require("../../models/Videos");
const { authenticate } = require("../../utils/authUtils");

router.patch("/:uuid", authenticate, async (req, res) => {
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
        .json({ message: "Not authorized to update this video" });
    }

    const updatableFields = [
      "previewimageurl",
      "videourl",
      "subtitles",
      "language",
      "title",
      "tags",
      "description",
      "duration",
    ];

    const invalidFields = Object.keys(req.body).filter(
      (field) => !updatableFields.includes(field)
    );

    if (invalidFields.length > 0) {
      return res.status(400).json({
        message: `Cannot update the following fields: ${invalidFields.join(
          ", "
        )}`,
      });
    }

    const updatedFields = {};
    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updatedFields[field] = req.body[field];
      }
    });

    const updatedVideo = await Video.findOneAndUpdate(
      { uuid },
      { $set: updatedFields },
      { new: true }
    );

    res.status(200).json({ video: updatedVideo });
  } catch (error) {
    console.error("Error updating video:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
