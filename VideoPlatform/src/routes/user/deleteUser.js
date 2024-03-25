const express = require("express");
const router = express.Router();
const UserModel = require("../../models/Users");
const VideoModel = require("../../models/Videos");
const { authenticate, verifyPassword } = require("../../utils/authUtils");

router.post("/", authenticate, async (req, res) => {
  const { password } = req.body;
  const authenticatedUserId = req.userUUID;

  try {
    // Retrieve the user to delete
    const userToDelete = await UserModel.findOne({
      useruuid: authenticatedUserId,
    });

    if (!userToDelete) {
      return res.status(404).json({ message: "User not found." });
    }

    // Verify the password
    const passwordValid = await verifyPassword(
      password,
      userToDelete.passwordhash
    );

    if (!passwordValid) {
      return res
        .status(401)
        .json({ message: "Incorrect password. User deletion aborted." });
    }

    // Remove the user from followers' following list and decrement their followingcount
    await UserModel.updateMany(
      { following: authenticatedUserId },
      {
        $pull: { following: authenticatedUserId },
        $inc: { followingcount: -1 },
      }
    );

    // Remove the user from following users' followers list and decrement their followercount
    await UserModel.updateMany(
      { followers: authenticatedUserId },
      {
        $pull: { followers: authenticatedUserId },
        $inc: { followercount: -1 },
      }
    );

    // Remove the user from the blocked list of other users and decrement their blockedCount
    await UserModel.updateMany(
      { blocked: authenticatedUserId },
      { $pull: { blocked: authenticatedUserId }, $inc: { blockedCount: -1 } }
    );

    // Remove the user from the beingBlocked list of other users and decrement their beingBlockedCount
    await UserModel.updateMany(
      { beingBlocked: authenticatedUserId },
      {
        $pull: { beingBlocked: authenticatedUserId },
        $inc: { beingBlockedCount: -1 },
      }
    );

    // Delete the user's videos
    await VideoModel.deleteMany({ uploaderuuid: authenticatedUserId });

    // Remove the user's likes from other videos and decrement their likecount
    await VideoModel.updateMany(
      { likes: authenticatedUserId },
      {
        $pull: { likes: authenticatedUserId },
        $inc: { likecount: -1 },
      }
    );

    // Remove the user's views from other videos and decrement their viewscount
    await VideoModel.updateMany(
      { "views.useruuid": authenticatedUserId },
      {
        $pull: { views: { useruuid: authenticatedUserId } },
        $inc: { viewscount: -1 },
      }
    );

    // Delete the user
    await UserModel.findOneAndDelete({ useruuid: authenticatedUserId });

    res.status(200).json({ message: "User successfully deleted." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting user", error: error.toString() });
  }
});

module.exports = router;
