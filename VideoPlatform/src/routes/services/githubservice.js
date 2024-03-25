// src/routes/services/githubservice.js
const express = require("express");
const router = express.Router();
const config = require("../../config");
const axios = require("axios");
const UserModel = require("../../models/Users");
const { v4: uuidv4 } = require("uuid");
const { generateToken } = require("../../utils/authUtils");
const argon2 = require("argon2");

router.get("/login", (req, res) => {
  const redirectUri = encodeURIComponent(
    `${config.backend_url}${config.github_auth_client_callback_url}`
  );
  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${config.github_auth_client_id}&redirect_uri=${redirectUri}`
  );
});

router.get("/callback", async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.redirect(
      `${config.frontend_url}/oauth-error?message=Authorization code is missing.`
    );
  }

  try {
    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: config.github_auth_client_id,
        client_secret: config.github_auth_client_secret,
        code: code,
      },
      {
        headers: {
          accept: "application/json",
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    if (accessToken) {
      const userProfileResponse = await axios.get(
        "https://api.github.com/user",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const userProfile = userProfileResponse.data;

      let user = await UserModel.findOne({ "oauthIds.id": userProfile.id });

      if (!user) {
        const useruuid = uuidv4();
        const username = `${userProfile.login}-${Math.random()
          .toString(36)
          .substring(7)}`;
        const password = Math.random().toString(36).slice(-8);
        const passwordWithPepper = password + config.serverPepper;
        const passwordhash = await argon2.hash(passwordWithPepper);

        user = new UserModel({
          useruuid,
          username,
          passwordhash,
          oauthIds: [{ provider: "github", id: userProfile.id }],
        });

        await user.save();
      }

      const token = generateToken(user);
      return res.redirect(
        `${config.frontend_url}/oauth-success?token=${token}`
      );
    } else {
      return res.redirect(
        `${config.frontend_url}/oauth-error?message=Access token not received from GitHub.`
      );
    }
  } catch (error) {
    return res.redirect(
      `${config.frontend_url}/oauth-error?message=${encodeURIComponent(
        error.message
      )}`
    );
  }
});

module.exports = router;
