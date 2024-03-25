// blockuser
const express = require("express");
const router = express.Router();
const UserModel = require("../../models/Users");
const { authenticate } = require("../../utils/authUtils");

// Endpoint to block a user
router.post("/:userToBlockUUID", authenticate, async (req, res) => {
  const { userToBlockUUID } = req.params;
  const userUUID = req.userUUID; // The blocker's UUID

  try {
    const [currentUser, userToBlock] = await Promise.all([
      UserModel.findOne({ useruuid: userUUID }),
      UserModel.findOne({ useruuid: userToBlockUUID }),
    ]);

    if (!currentUser || !userToBlock) {
      return res.status(404).json({ message: "User not found." });
    }

    if (currentUser.blocked.includes(userToBlockUUID)) {
      return res.status(409).json({ message: "User already blocked." });
    }

    // Prepare updates for both users, considering following/follower relationships
    const updates = [
      UserModel.updateOne(
        { useruuid: userUUID },
        {
          $addToSet: { blocked: userToBlockUUID },
          $pull: { following: userToBlockUUID, followers: userToBlockUUID },
          $inc: {
            blockedCount: 1,
            followingcount: currentUser.following.includes(userToBlockUUID)
              ? -1
              : 0,
            followercount: currentUser.followers.includes(userToBlockUUID)
              ? -1
              : 0,
          },
        }
      ),
      UserModel.updateOne(
        { useruuid: userToBlockUUID },
        {
          $addToSet: { beingBlocked: userUUID },
          $pull: { following: userUUID, followers: userUUID },
          $inc: {
            beingBlockedCount: 1,
            followingcount: userToBlock.following.includes(userUUID) ? -1 : 0,
            followercount: userToBlock.followers.includes(userUUID) ? -1 : 0,
          },
        }
      ),
    ];

    const results = await Promise.all(updates);

    if (results.every((result) => result.modifiedCount > 0)) {
      res.status(200).json({
        message: "User blocked successfully, and follow relationships updated.",
      });
    } else {
      res.status(409).json({
        message:
          "Could not perform block operation or update follow relationships.",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Error blocking user", error });
  }
});

module.exports = router;