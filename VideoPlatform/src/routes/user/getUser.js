// src/routes/user/getUser.js

const express = require('express');
const router = express.Router();
const UserModel = require('../../models/Users');

// Endpoint to retrieve user by UUID
router.get('/:uuid', async (req, res) => {
    try {
        const user = await UserModel.findOne({ useruuid: req.params.uuid });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error });
    }
});

module.exports = router;
