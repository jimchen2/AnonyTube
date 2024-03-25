// src/routes/user/updateProfileImage.js
const express = require('express');
const router = express.Router();
const UserModel = require('../../models/Users');
const { authenticate } = require('../../utils/authUtils');

router.put('/', authenticate, async (req, res) => {
    const userUUID = req.userUUID;
    const { userimageurl } = req.body;

    if (!userimageurl) {
        return res.status(400).json({ message: 'Profile image URL is required.' });
    }

    try {
        const updateResult = await UserModel.updateOne({ useruuid: userUUID }, { $set: { userimageurl } });

        if (updateResult.nModified === 0) {
            res.status(404).json({ message: 'User not found or no changes made.' });
        } else {
            res.status(200).json({ message: 'Profile image updated successfully.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile image', error });
    }
});

module.exports = router;
