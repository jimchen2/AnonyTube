// src/routes/video/searchVideosCount.js
const express = require("express");
const router = express.Router();
const Video = require("../../models/Videos");

router.get("/", async (req, res) => {
  try {
    const {
      query,
      durationMin,
      durationMax,
      uploadedAfter,
      uploadedBefore,
      language,
      resolution,
      uploaderuuid,
      hasuserwatched,
      watchedunwatched,
      uuid,
      hasnotwatched,
    } = req.query;
    const searchRegex = new RegExp(query, "i");

    const searchConditions = {
      $or: [
        { title: searchRegex },
        { tags: searchRegex },
        { description: searchRegex },
        { uuid: searchRegex },
      ],
    };

    if (durationMin) {
      searchConditions.duration = {
        ...searchConditions.duration,
        $gte: parseInt(durationMin),
      };
    }

    if (durationMax) {
      searchConditions.duration = {
        ...searchConditions.duration,
        $lte: parseInt(durationMax),
      };
    }

    if (uploadedAfter) {
      searchConditions.createdAt = {
        ...searchConditions.createdAt,
        $gte: new Date(uploadedAfter),
      };
    }

    if (uploadedBefore) {
      searchConditions.createdAt = {
        ...searchConditions.createdAt,
        $lte: new Date(uploadedBefore),
      };
    }

    if (language) {
      searchConditions.language = language;
    }

    if (resolution) {
      searchConditions["videourl.quality"] = resolution;
    }

    if (uploaderuuid) {
      searchConditions.uploaderuuid = uploaderuuid;
    }

    if (uuid) {
      searchConditions.uuid = uuid;
    }

    if (hasuserwatched) {
      searchConditions["views.useruuid"] = hasuserwatched;
    }

    if (watchedunwatched === "watched") {
      searchConditions["views.useruuid"] = { $exists: true };
    } else if (watchedunwatched === "unwatched") {
      searchConditions["views.useruuid"] = { $exists: false };
    }

    if (hasnotwatched) {
      searchConditions["views.useruuid"] = { $ne: hasnotwatched };
    }

    const totalResults = await Video.countDocuments(searchConditions);

    res.status(200).json({ totalResults });
  } catch (error) {
    console.error("Error getting search videos count:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;