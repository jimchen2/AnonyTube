// src/routes/user/linkOAuth.js
const express = require("express");
const router = express.Router();
const UserModel = require("../../models/Users");
const { authenticate } = require("../../utils/authUtils");

router.get("/", authenticate, async (req, res) => {
  const userUUID = req.userUUID;
  const { provider, id, username } = req.query;

  if (!provider || !id || !username) {
    return res.status(400).json({ message: "Missing OAuth information." });
  }

  try {
    // Find the user by their UUID
    const user = await UserModel.findOne({ useruuid: userUUID });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if the OAuth provider and ID are already linked to the user
    const existingOAuthIndex = user.oauthIds.findIndex(
      (oauthId) => oauthId.provider === provider && oauthId.id === id
    );

    if (existingOAuthIndex !== -1) {
      return res.status(400).json({ message: "OAuth account already linked." });
    }

    // Add the OAuth provider and ID to the user's oauthIds array
    user.oauthIds.push({ provider, id });

    // Save the updated user document
    await user.save();

    // Redirect to a success page or return a success response
    res.redirect("/oauth-success");
    // or
    // res.status(200).json({ message: "OAuth account linked successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error linking OAuth account", error });
  }
});

module.exports = router;