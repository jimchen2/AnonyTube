// src/routes/user/loginUser.js

const express = require('express');
const router = express.Router();
const UserModel = require('../../models/Users');
const { generateToken, verifyPassword } = require('../../utils/authUtils');

// Endpoint for logging in a user
router.post('/', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Authenticate the user
        const user = await UserModel.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Authentication failed: username does not exist.' });
        }


        // Verify the password with Argon2, considering the pepper
        const validPassword = await verifyPassword(password, user.passwordhash);
        if (!validPassword) {
            return res.status(401).json({ message: 'Authentication failed: incorrect password.' });
        }

        // Generate a JWT token
        const token = generateToken(user);

        res.json({
            message: 'Login successful',
            token
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in user', error });
    }
});

module.exports = router;
