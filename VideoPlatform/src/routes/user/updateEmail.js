// src/routes/user/updateEmail.js
const express = require("express");
const router = express.Router();
const UserModel = require("../../models/Users");
const { authenticate } = require("../../utils/authUtils");
const argon2 = require("argon2");
const config = require("../../config");

router.put("/", authenticate, async (req, res) => {
  const userUUID = req.userUUID;
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "An email address is required." });
  }

  try {
    const hashedEmail = await argon2.hash(email + config.serverPepper);

    const updateResult = await UserModel.updateOne(
      { useruuid: userUUID },
      { $set: { emailHashed: hashedEmail } }
    );

    if (updateResult.nModified === 0) {
      res.status(404).json({ message: "User not found or no changes made." });
    } else {
      res.status(200).json({ message: "Email address updated successfully." });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating email address", error });
  }
});

module.exports = router;
