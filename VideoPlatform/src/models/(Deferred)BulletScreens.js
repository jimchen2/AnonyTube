const mongoose = require("mongoose");

const BulletScreenSchema = new mongoose.Schema({
    videoUuid: { type: String, required: true, ref: 'Video' }, // Reference to the Video
    time: { type: Number, required: true }, // Time offset in seconds from the start of the video
    text: { type: String, required: true }
}, { timestamps: true });

const BulletScreen = mongoose.model("BulletScreen", BulletScreenSchema);

module.exports = BulletScreen;
