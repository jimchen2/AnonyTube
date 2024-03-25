// src/routes/user/updateUser.js
const express = require("express");
const router = express.Router();
const UserModel = require("../../models/Users");
const { authenticate } = require("../../utils/authUtils");
const argon2 = require("argon2");
const config = require("../../config");

router.put("/", authenticate, async (req, res) => {
  const userUUID = req.userUUID;
  const { username, bio, userimageurl, socialMediaLinks, email, phone } =
    req.body;

  try {
    // Find the user by their useruuid
    const user = await UserModel.findOne({ useruuid: userUUID });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update the user's fields
    if (username && username !== user.username) {
      // Check for username change and ensure new username doesn't already exist
      const existingUser = await UserModel.findOne({ username: username });
      if (existingUser) {
        return res.status(409).json({ message: "Username is already taken." });
      }
      user.username = username;
    }

    if (bio !== undefined) {
      user.bio = bio;
    }

    if (userimageurl) {
      user.userimageurl = userimageurl;
    }

    if (socialMediaLinks && Array.isArray(socialMediaLinks)) {
      user.socialMediaLinks = socialMediaLinks;
    }

    if (email) {
      const hashedEmail = await argon2.hash(email + config.serverPepper);
      user.emailHashed = hashedEmail;
    }

    if (phone) {
      const hashedPhone = await argon2.hash(phone + config.serverPepper);
      user.phoneHashed = hashedPhone;
    }

    // Save the updated user
    await user.save();

    res.status(200).json({ message: "User profile updated successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error updating user profile", error });
  }
});

module.exports = router;
