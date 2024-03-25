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

    const viewIndex = video.views.findIndex(
      (view) => view.useruuid === userUUID
    );

    if (viewIndex === -1) {
      video.views.push({ useruuid: userUUID, dates: [new Date()] });
      video.viewscount = video.viewscount + 1;
    } else {
      const lastViewDate =
        video.views[viewIndex].dates[video.views[viewIndex].dates.length - 1];
      const currentDate = new Date();

      if (lastViewDate.toDateString() !== currentDate.toDateString()) {
        video.views[viewIndex].dates.push(currentDate);
        video.viewscount = video.viewscount + 1;
      } else {
        return res.status(200).json({ message: "Video view not added" });
      }
    }

    await video.save();

    res.status(200).json({ message: "Video view added successfully" });
  } catch (error) {
    console.error("Error adding video view:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
