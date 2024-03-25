// src/routes/user/unlinkOAuth.js
const express = require("express");
const router = express.Router();
const UserModel = require("../../models/Users");
const { authenticate } = require("../../utils/authUtils");

router.put("/", authenticate, async (req, res) => {
  const userUUID = req.userUUID;
  const { provider } = req.body;

  if (!provider) {
    return res.status(400).json({ message: "OAuth provider is required." });
  }

  try {
    // Find the user by their UUID
    const user = await UserModel.findOne({ useruuid: userUUID });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Find the index of the OAuth ID with the specified provider
    const oauthIdIndex = user.oauthIds.findIndex(
      (oauthId) => oauthId.provider === provider
    );

    if (oauthIdIndex === -1) {
      return res
        .status(404)
        .json({ message: `No linked ${provider} account found.` });
    }

    // Remove the OAuth ID from the user's oauthIds array
    user.oauthIds.splice(oauthIdIndex, 1);

    // Save the updated user document
    await user.save();

    res
      .status(200)
      .json({ message: `${provider} account unlinked successfully.` });
  } catch (error) {
    res.status(500).json({ message: "Error unlinking OAuth account", error });
  }
});

module.exports = router;
