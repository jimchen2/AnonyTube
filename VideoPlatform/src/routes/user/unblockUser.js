const express = require("express");
const router = express.Router();
const UserModel = require("../../models/Users");
const { authenticate } = require("../../utils/authUtils");

// Endpoint to unblock a user
router.post("/:userToUnblockUUID", authenticate, async (req, res) => {
  const { userToUnblockUUID } = req.params;
  const userUUID = req.userUUID; // The unblocker's UUID

  try {
    const [currentUser, userToUnblock] = await Promise.all([
      UserModel.findOne({ useruuid: userUUID }),
      UserModel.findOne({ useruuid: userToUnblockUUID }),
    ]);

    if (!currentUser || !userToUnblock) {
      return res.status(404).json({ message: "User not found." });
    }

    if (!currentUser.blocked.includes(userToUnblockUUID)) {
      return res.status(409).json({ message: "User is not blocked." });
    }

    // Prepare updates for both users, considering following/follower relationships
    const updates = [
      UserModel.updateOne(
        { useruuid: userUUID },
        {
          $pull: { blocked: userToUnblockUUID },
          $inc: { blockedCount: -1 },
        }
      ),
      UserModel.updateOne(
        { useruuid: userToUnblockUUID },
        {
          $pull: { beingBlocked: userUUID },
          $inc: { beingBlockedCount: -1 },
        }
      ),
    ];

    const results = await Promise.all(updates);

    if (results.every((result) => result.modifiedCount > 0)) {
      res.status(200).json({
        message: "User unblocked successfully.",
      });
    } else {
      res.status(409).json({
        message: "Could not perform unblock operation.",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Error unblocking user", error });
  }
});

module.exports = router;
