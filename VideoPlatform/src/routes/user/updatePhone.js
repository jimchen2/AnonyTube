// src/routes/user/updatePhone.js
const express = require("express");
const router = express.Router();
const UserModel = require("../../models/Users");
const { authenticate } = require("../../utils/authUtils");
const argon2 = require("argon2");
const config = require("../../config");

router.put("/", authenticate, async (req, res) => {
  const userUUID = req.userUUID;
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ message: "A phone number is required." });
  }

  try {
    // Assuming phone is to be stored in phoneHashed after being hashed
    const hashedPhone = await argon2.hash(phone + config.serverPepper);
    const updateResult = await UserModel.updateOne(
      { useruuid: userUUID },
      { $set: { phoneHashed: hashedPhone } }
    );

    if (updateResult.nModified === 0) {
      res.status(404).json({ message: "User not found or no changes made." });
    } else {
      res.status(200).json({ message: "Phone number updated successfully." });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating phone number", error });
  }
});

module.exports = router;
