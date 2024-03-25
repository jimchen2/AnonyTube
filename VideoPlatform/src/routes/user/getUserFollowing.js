// src/routes/user/getUserFollowing.js

const express = require('express');
const router = express.Router();
const UserModel = require('../../models/Users');

// Endpoint to get the list of users that a specific user is following
router.get('/:userUUID', async (req, res) => {
    const { userUUID } = req.params;

    try {
        const user = await UserModel.findOne({ useruuid: userUUID }, 'following');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ following: user.following });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving following list', error });
    }
});

module.exports = router;
