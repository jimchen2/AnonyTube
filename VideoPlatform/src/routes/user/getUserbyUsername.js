// src/routes/user/getUserByUsername.js

const express = require('express');
const router = express.Router();
const UserModel = require('../../models/Users');

// Endpoint to retrieve user by username
router.get('/:username', async (req, res) => {
    try {
        const user = await UserModel.findOne({ username: req.params.username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Exclude sensitive information from the response
        const { email, phone, ...userWithoutSensitiveInfo } = user.toObject();
        res.json(userWithoutSensitiveInfo);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error });
    }
});

module.exports = router;