const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const config = require("./config");
const connectDB = require("./utils/db");

// User route imports
const blockUser = require("./routes/user/blockUser");
const createUser = require("./routes/user/createUser");
const deleteUser = require("./routes/user/deleteUser");
const followUser = require("./routes/user/followUser");
const getUserBeingBlocked = require("./routes/user/getUserBeingBlocked");
const getUserBlocked = require("./routes/user/getUserBlocked");
const getUserFollowers = require("./routes/user/getUserFollowers");
const getUserFollowing = require("./routes/user/getUserFollowing");
const getUser = require("./routes/user/getUser");
const getUserbyUsername = require("./routes/user/getUserbyUsername.js");
const listUsers = require("./routes/user/listUsers");
const loginUser = require("./routes/user/loginUser");
const unblockUser = require("./routes/user/unblockUser");
const unfollowUser = require("./routes/user/unfollowUser");
const updateBio = require("./routes/user/updateBio");
const updatePhone = require("./routes/user/updatePhone");
const updateEmail = require("./routes/user/updateEmail");
const updatePassword = require("./routes/user/updatePassword");
const updatePasswordNew = require("./routes/user/updatePasswordNew");
const updateProfileImage = require("./routes/user/updateProfileImage");
const updateSocialLinks = require("./routes/user/updateSocialLinks");
const updateUsername = require("./routes/user/updateUsername");
const searchUser = require("./routes/user/searchUser.js");
const linkOauth = require("./routes/user/linkoauth.js");
const unlinkOAuth = require("./routes/user/unlinkoauth.js");
const updateUser = require("./routes/user/updateUser.js");
const getUserbyToken = require("./routes/user/getUserbyToken.js");

// Video route imports
const addVideoView = require("./routes/video/addVideoView");
const createVideo = require("./routes/video/createVideo");
const deleteVideo = require("./routes/video/deleteVideo");
const getVideo = require("./routes/video/getVideo");
const getVideoLikes = require("./routes/video/getVideoLikes");
const getVideoViews = require("./routes/video/getVideoViews");
const likeVideo = require("./routes/video/likeVideo");
const listVideos = require("./routes/video/listVideos");
const searchVideos = require("./routes/video/searchVideos");
const searchVideosCount = require("./routes/video/searchVideosCount.js");
const unlikeVideo = require("./routes/video/unlikeVideo");
const updateVideo = require("./routes/video/updateVideo");
const isUserLikedRoute = require("./routes/video/isUserLiked");

// Comment route imports
// const createComment = require("./routes/comment/createcomment.js");
const githubService = require("./routes/services/githubservice.js");
const verifyToken = require("./routes/services/verifytoken.js");
const generatePresignedUrl = require("./routes/services/generatePresignedUrl.js");

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // For parsing application/json

if (process.env.NODE_ENV !== "test") {
  connectDB();
}

// User routes setup
app.use("/user/block", blockUser);
app.use("/user/create", createUser);
app.use("/user/delete", deleteUser);
app.use("/user/follow", followUser);
app.use("/user/getUserBeingBlocked", getUserBeingBlocked);
app.use("/user/getUserBlocked", getUserBlocked);
app.use("/user/getUserFollowers", getUserFollowers);
app.use("/user/getUserFollowing", getUserFollowing);
app.use("/user/get", getUser);
app.use("/user/list", listUsers);
app.use("/user/login", loginUser);
app.use("/user/unblock", unblockUser);
app.use("/user/unfollow", unfollowUser);
app.use("/user/updateBio", updateBio);
app.use("/user/updatePhone", updatePhone);
app.use("/user/updateEmail", updateEmail);
app.use("/user/updatePassword", updatePassword);
app.use("/user/updatePasswordNew", updatePasswordNew);
app.use("/user/updateProfileImage", updateProfileImage);
app.use("/user/updateSocialLinks", updateSocialLinks);
app.use("/user/updateUsername", updateUsername);
app.use("/user/updateUser", updateUser);
app.use("/user/linkOauth", linkOauth);
app.use("/user/unlinkOAuth", unlinkOAuth);
app.use("/user/seach", searchUser);
app.use("/user/getUserbyUsername", getUserbyUsername);
app.use("/user/getUserbyToken", getUserbyToken);

// // Video routes setup
app.use("/video/addView", addVideoView);
app.use("/video/create", createVideo);
app.use("/video/get", getVideo);
app.use("/video/isLiked", isUserLikedRoute);
app.use("/video/likes", getVideoLikes);
app.use("/video/views", getVideoViews);
app.use("/video/like", likeVideo);
app.use("/video/unlike", unlikeVideo);
app.use("/video/delete", deleteVideo);
app.use("/video/list", listVideos);
app.use("/video/search", searchVideos);
app.use("/video/search/count", searchVideosCount);
app.use("/video/update", updateVideo);

// Comment Routes
// app.use("/comment/createcomment", createComment);

//service routes
app.use("/services/github", githubService);
app.use("/verifytoken", verifyToken);
app.use("/generatePresignedUrl", generatePresignedUrl);

app.use((err, req, res, next) => {
  console.error("Error stack:", err.stack);
  res.status(500).json({ error: err.message });
});

if (process.env.NODE_ENV !== "test") {
  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
}

module.exports = app;
