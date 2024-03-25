// src/routes/user/getUserFollowers.js

const express = require('express');
const router = express.Router();
const UserModel = require('../../models/Users');

// Endpoint to get a user's followers
router.get('/:userUUID', async (req, res) => {
    const { userUUID } = req.params;

    try {
        const user = await UserModel.findOne({ useruuid: userUUID }, 'followers');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ followers: user.followers });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving followers', error });
    }
});

module.exports = router;
