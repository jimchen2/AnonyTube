// src/routes/user/updatePassword.js
const express = require("express");
const router = express.Router();
const UserModel = require("../../models/Users");
const { authenticate } = require("../../utils/authUtils");
const argon2 = require("argon2");
const config = require("../../config");

router.put("/", authenticate, async (req, res) => {
  const userUUID = req.userUUID;
  const { newPassword } = req.body;

  if (!newPassword) {
    return res.status(400).json({ message: "New password is required." });
  }

  try {
    const hashedNewPassword = await argon2.hash(
      newPassword + config.serverPepper
    );

    const updateResult = await UserModel.updateOne(
      { useruuid: userUUID },
      { $set: { passwordhash: hashedNewPassword } }
    );

    if (updateResult.nModified === 0) {
      res.status(404).json({ message: "User not found or no changes made." });
    } else {
      res.status(200).json({ message: "Password updated successfully." });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating password", error });
  }
});

module.exports = router;
