// src/routes/user/updateSocialLinks.js
const express = require("express");
const router = express.Router();
const UserModel = require("../../models/Users");
const { authenticate } = require("../../utils/authUtils");

router.put("/", authenticate, async (req, res) => {
  const userUUID = req.userUUID;
  const { socialMediaLinks } = req.body;

  if (!socialMediaLinks || !Array.isArray(socialMediaLinks)) {
    return res
      .status(400)
      .json({ message: "Social media links array is required." });
  }
  try {
    const updateResult = await UserModel.updateOne(
      { useruuid: userUUID },
      { $set: { socialMediaLinks } }
    );

    if (updateResult.nModified === 0) {
      res.status(404).json({ message: "User not found or no changes made." });
    } else {
      res
        .status(200)
        .json({ message: "Social media links updated successfully." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating social media links", error });
  }
});

module.exports = router;
