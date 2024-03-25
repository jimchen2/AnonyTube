// src/routes/user/updatePassword.js
const express = require("express");
const UserModel = require("../../models/Users");
const argon2 = require("argon2");
const config = require("../../config");
const { verifyResetToken } = require("../../utils/authUtils");

const router = express.Router();

router.post("/", async (req, res) => {
  const { resetToken, newPassword } = req.body;

  // Validate input
  if (!resetToken || !newPassword) {
    return res
      .status(400)
      .json({ message: "Reset token and new password are required." });
  }

  // Verify reset token
  const decoded = verifyResetToken(resetToken);
  if (!decoded) {
    return res.status(401).json({ message: "Invalid or expired reset token." });
  }

  try {
    const user = await UserModel.findOne({ id: decoded.id });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Hash the new password
    const hashedNewPassword = await argon2.hash(
      newPassword + config.serverPepper
    );
    user.passwordhash = hashedNewPassword; // Or whatever your password field is named
    await user.save();

    res.status(200).json({ message: "Password successfully updated." });
  } catch (err) {
    res.status(500).json({ message: "Error updating password", error: err });
  }
});

module.exports = router;
