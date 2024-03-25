// src/routes/user/updateBio.js
const express = require("express");
const router = express.Router();
const UserModel = require("../../models/Users");
const { authenticate } = require("../../utils/authUtils");

router.put("/", authenticate, async (req, res) => {
  const userUUID = req.userUUID;
  const { bio } = req.body;

  if (bio === undefined) {
    return res.status(400).json({ message: "Bio is required." });
  }

  try {
    // Find the user by their useruuid
    const user = await UserModel.findOne({ useruuid: userUUID });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update the user's bio
    user.bio = bio;
    await user.save();

    res.status(200).json({ message: "Bio updated successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error updating bio", error });
  }
});

module.exports = router;
