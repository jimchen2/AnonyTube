// src/routes/user/uploadFile.js

const express = require("express");
const router = express.Router();
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const config = require("../../config");
const { v4: uuidv4 } = require("uuid");
const { authenticate } = require("../../utils/authUtils");

const s3Client = new S3Client({
  region: "auto",
  credentials: {
    accessKeyId: config.s3_access_key,
    secretAccessKey: config.s3_secret_key,
  },
  endpoint: config.s3_endpoint,
  forcePathStyle: true,
  signatureVersion: "v4",
});

router.post("/", authenticate, async (req, res) => {
  try {
    const { type } = req.body;
    const userId = req.userUUID; // Assuming the authenticated user ID is available in req.user.id

    let objectKey;
    if (type === "image") {
      objectKey = `images/${userId}/${uuidv4()}.jpg`; // Generate a unique object key for images
    } else if (type === "video") {
      objectKey = `videos/${userId}/${uuidv4()}.mp4`; // Generate a unique object key for videos
    } else if (type === "subtitle") {
      objectKey = `subtitles/${userId}/${uuidv4()}.srt`; // Generate a unique object key for subtitles
    } else {
      return res.status(400).json({ message: "Invalid file type" });
    }

    const command = new PutObjectCommand({
      Bucket: config.s3_bucket,
      Key: objectKey,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 300000 });

    res.json({ url, objectKey });
  } catch (error) {
    console.error("Error generating pre-signed URL", error);
    res.status(500).json({ message: "Error generating pre-signed URL" });
  }
});

module.exports = router;
