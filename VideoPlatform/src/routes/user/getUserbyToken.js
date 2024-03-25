// src/routes/user/getUserByToken.js
const express = require("express");
const router = express.Router();
const UserModel = require("../../models/Users");
const { verifyToken } = require("../../utils/authUtils");

router.get("/", async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Authentication token is missing" });
  }

  try {
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    const user = await UserModel.findOne({ useruuid: decoded.useruuid });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the full user schema in the response
    res.status(200).json({
      useruuid: user.useruuid,
      username: user.username,
      userimageurl: user.userimageurl,
      socialMediaLinks: user.socialMediaLinks,
      bio: user.bio,
      followers: user.followers,
      followercount: user.followercount,
      following: user.following,
      followingcount: user.followingcount,
      blocked: user.blocked,
      blockedCount: user.blockedCount,
      beingBlocked: user.beingBlocked,
      beingBlockedCount: user.beingBlockedCount,
      creationdate: user.creationdate,
      emailHashed: user.emailHashed,
      phoneHashed: user.phoneHashed,
      suspended: user.suspended,
      oauthIds: user.oauthIds,
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user", error });
  }
});

module.exports = router;
