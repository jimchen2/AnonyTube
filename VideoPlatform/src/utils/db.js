// src/db.js
const mongoose = require("mongoose");
const User = require("../models/Users");
const Video = require("../models/Videos");
const Comment = require("../models/(Deferred)Comments"); // Import the Comment model
const config = require("../config");

const connectDB = async () => {
  try {
    console.log(`${config.mongoURI}`);

    await mongoose.connect(`${config.mongoURI}`, {});
    // console.log("MongoDB connected...");

    // User Collection Indexes
    User.collection.createIndex({ useruuid: 1 });
    User.collection.createIndex({ username: 1 }, { unique: true });
    User.collection.createIndex({ followercount: -1 });
    User.collection.createIndex({ suspended: 1 });
    User.collection.createIndex({ blocked: 1 });
    User.collection.createIndex({ beingBlocked: 1 });
    User.collection.createIndex(
      { "oauthIds.provider": 1, "oauthIds.id": 1 },
      {
        unique: true,
        partialFilterExpression: {
          "oauthIds.provider": { $exists: true },
          "oauthIds.id": { $exists: true },
        },
      }
    );

    // Video Collection Indexes
    Video.collection.createIndex({ "videourl.url": 1 });
    Video.collection.createIndex({ language: 1 });
    Video.collection.createIndex({ title: 1 });
    Video.collection.createIndex({ uploaderuuid: 1 });
    Video.collection.createIndex({ viewscount: -1 });
    Video.collection.createIndex({ tags: 1 });
    Video.collection.createIndex({ description: 1 });
    Video.collection.createIndex({ duration: 1 });
    Video.collection.createIndex({ flagged: 1 });

    // Comment Collection Indexes
    // Comment.collection.createIndex({ videoUuid: 1 });
    // Comment.collection.createIndex({ date: -1 });
    // Comment.collection.createIndex({ likes: -1 });
    // Comment.collection.createIndex({ parentCommentId: 1 });
  } catch (err) {
    console.error("Unable to connect to MongoDB", err);
  }
};

module.exports = connectDB;
