// src/routes/user/listUsers.js

const express = require('express');
const router = express.Router();
const UserModel = require('../../models/Users');

// Endpoint to list users with potential query parameters
router.get('/', async (req, res) => {
    try {
        const { query, sort, limit } = req.query;
        const searchRegex = new RegExp(query, 'i');

        const searchConditions = {
            $or: [
                { username: searchRegex },
                { bio: searchRegex },
                { useruuid: searchRegex },
            ],
        };

        let sortConditions = {};

        switch (sort) {
            case 'username':
                sortConditions = { username: 1 };
                break;
            case 'bio':
                sortConditions = { bio: 1 };
                break;
            default:
                sortConditions = { username: 1 };
        }

        const limitValue = parseInt(limit) || 10; // Default limit is 10

        const users = await UserModel.find(searchConditions)
            .sort(sortConditions)
            .limit(limitValue);

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error listing users', error });
    }
});

module.exports = router;