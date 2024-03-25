const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid"); // Import UUID generation function

const UserSchema = new mongoose.Schema(
  {
    useruuid: {
      type: String,
      required: true,
      unique: true,
      default: () => uuidv4(),
    },
    username: { type: String, required: true, unique: true },
    passwordhash: { type: String, required: true },
    userimageurl: String,
    socialMediaLinks: [
      {
        name: String,
        url: String,
        _id: false,
      },
    ],
    bio: String,
    followers: [String],
    followercount: { type: Number, default: 0 },
    following: [String],
    followingcount: { type: Number, default: 0 },
    blocked: [String],
    blockedCount: { type: Number, default: 0 },
    beingBlocked: [String],
    beingBlockedCount: { type: Number, default: 0 },
    creationdate: { type: Date, default: Date.now },
    emailHashed: { type: String, default: "" },
    phoneHashed: { type: String, default: "" },
    suspended: { type: Boolean, default: false },
    oauthIds: [
      {
        provider: String,
        id: String,
        _id: false,
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
