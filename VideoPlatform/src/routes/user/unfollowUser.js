// src/routes/user/unfollowUser.js

const express = require("express");
const router = express.Router();
const UserModel = require("../../models/Users");
const { authenticate } = require("../../utils/authUtils");

// Endpoint to unfollow a user
router.post("/:userToUnfollowUUID", authenticate, async (req, res) => {
  const { userToUnfollowUUID } = req.params;
  const userUUID = req.userUUID; // Get the authenticated user's UUID from the token

  try {
    // Check if the user is already following the user to unfollow
    const user = await UserModel.findOne({ useruuid: userUUID });
    if (!user.following.includes(userToUnfollowUUID)) {
      return res.status(400).json({ message: "User is not being followed" });
    }

    // Remove the current user's UUID from the unfollowed user's followers array and decrement followercount
    const result = await UserModel.updateOne(
      { useruuid: userToUnfollowUUID },
      {
        $pull: { followers: userUUID },
        $inc: { followercount: -1 },
      }
    );

    // Remove the unfollowed user's UUID from the current user's following array and decrement followingcount
    const result2 = await UserModel.updateOne(
      { useruuid: userUUID },
      {
        $pull: { following: userToUnfollowUUID },
        $inc: { followingcount: -1 },
      }
    );

    if (result.modifiedCount === 0 || result2.modifiedCount === 0) {
      return res.status(400).json({ message: "Unfollow action failed" });
    }

    res.status(200).json({ message: "Unfollowed user successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error unfollowing user", error });
  }
});

module.exports = router;