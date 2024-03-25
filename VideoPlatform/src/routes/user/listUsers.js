// src/routes/user/listUsers.js

const express = require('express');
const router = express.Router();
const UserModel = require('../../models/Users');

// Endpoint to list users with potential query parameters
router.get('/', async (req, res) => {
    try {
        const query = {};
        // Extend query object based on any filters you might want to implement, e.g., searching by username
        const users = await UserModel.find(query);
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error listing users', error });
    }
});

module.exports = router;
