// followUser
const express = require("express");
const router = express.Router();
const UserModel = require("../../models/Users");
const { authenticate } = require("../../utils/authUtils");

router.post("/:userToFollowUUID", authenticate, async (req, res) => {
  const { userToFollowUUID } = req.params;
  const userUUID = req.userUUID;

  try {
    const currentUser = await UserModel.findOne({ useruuid: userUUID });
    const userToFollow = await UserModel.findOne({
      useruuid: userToFollowUUID,
    });

    if (!currentUser || !userToFollow) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the current user is blocked by or has blocked the user they intend to follow
    if (
      currentUser.blocked.includes(userToFollowUUID) ||
      userToFollow.blocked.includes(userUUID)
    ) {
      return res.status(403).json({
        message: "Following is prohibited due to a block relationship",
      });
    }

    if (currentUser.following.includes(userToFollowUUID)) {
      return res.status(409).json({ message: "Already following this user" });
    }

    await UserModel.updateOne(
      { useruuid: userUUID },
      {
        $addToSet: { following: userToFollowUUID },
        $inc: { followingcount: 1 },
      }
    );
    await UserModel.updateOne(
      { useruuid: userToFollowUUID },
      { $addToSet: { followers: userUUID }, $inc: { followercount: 1 } }
    );

    res.status(200).json({ message: "Followed user successfully" });
  } catch (error) {
    console.error("Error following user:", error);
    res
      .status(500)
      .json({ message: "An error occurred while following the user" });
  }
});

module.exports = router;
