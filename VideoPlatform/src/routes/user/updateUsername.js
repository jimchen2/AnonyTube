// src/routes/user/updateUsername.js
const express = require("express");
const router = express.Router();
const UserModel = require("../../models/Users");
const { authenticate } = require("../../utils/authUtils");

router.put("/", authenticate, async (req, res) => {
  const userUUID = req.userUUID;
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ message: "New username is required." });
  }

  try {
    // Ensure new username doesn't already exist
    const existingUser = await UserModel.findOne({ username: username });
    if (existingUser) {
      return res.status(409).json({ message: "Username is already taken." });
    }

    // Update the username in the database
    const updateResult = await UserModel.updateOne(
      { useruuid: userUUID }, // Use 'useruuid' to match your schema
      { $set: { username } }
    );

    if (updateResult.nModified === 0) {
      return res
        .status(404)
        .json({ message: "User not found or no changes made." });
    }

    res.status(200).json({ message: "Username updated successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error updating username", error });
  }
});

module.exports = router;
