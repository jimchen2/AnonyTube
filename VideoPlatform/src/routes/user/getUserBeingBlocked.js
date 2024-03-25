// src/routes/user/getUserBeingBlocked.js

const express = require('express');
const router = express.Router();
const UserModel = require('../../models/Users');

// Endpoint to get the list of users who have blocked a specific user
router.get('/:userUUID', async (req, res) => {
    const { userUUID } = req.params;

    try {
        const user = await UserModel.findOne({ useruuid: userUUID }, 'beingBlocked');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ beingBlocked: user.beingBlocked });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving being blocked list', error });
    }
});

module.exports = router;
