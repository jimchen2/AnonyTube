const express = require("express");
const router = express.Router();
const UserModel = require("../../models/Users");
const { v4: uuidv4 } = require("uuid");
const { generateToken } = require("../../utils/authUtils");
const argon2 = require("argon2");
const config = require("../../config");

router.post("/", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required." });
  }

  try {
    // Check if the username already exists
    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists." });
    }

    const useruuid = uuidv4();
    const passwordWithPepper = password + config.serverPepper;
    const passwordhash = await argon2.hash(passwordWithPepper);

    const newUser = new UserModel({
      useruuid,
      username,
      passwordhash,
    });

    const savedUser = await newUser.save();

    const userForResponse = {
      useruuid: savedUser.useruuid,
      username: savedUser.username,
      followers: savedUser.followers,
      followercount: savedUser.followercount,
      following: savedUser.following,
      followingcount: savedUser.followingcount,
      blocked: savedUser.blocked,
      blockedCount: savedUser.blockedCount,
      beingBlocked: savedUser.beingBlocked,
      beingBlockedCount: savedUser.beingBlockedCount,
      creationdate: savedUser.creationdate,
    };

    const token = generateToken(savedUser);

    res.status(201).json({
      user: userForResponse,
      token,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Error creating user." });
  }
});

module.exports = router;
