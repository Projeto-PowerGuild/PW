const express = require('express');
const router = express.Router();
const User = require('../models/authModel'); // Import the User model

// authRoute.js
router.post('/signup', async (req, res) => {
    try {
        const user = await User.signUp(req.body.username, req.body.email, req.body.password);
        req.session.isLoggedIn = true;
        req.session.user = { id: user.id, username: user.username, email: user.email };
        res.redirect('/'); // Redirect or send user data
    } catch (error) {
        console.error("Error signing up:", error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findByUsername(username);
        if (user && await user.verifyPassword(password)) {
            req.session.isLoggedIn = true;
            req.session.user = { id: user.id, username: user.username, email: user.email };
            res.json({ success: true, message: "Login successful" });
        } else {
            res.status(401).json({ success: false, message: "Invalid username or password" });
        }
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/session', (req, res) => {
    if (req.session.isLoggedIn && req.session.user) {
        res.json({ isLoggedIn: true, user: req.session.user });
    } else {
        res.json({ isLoggedIn: false });
    }
});

router.get('/logout', (req, res) => {
    // Destroy session to log out user
    req.session.destroy((err) => {
        if (err) {
            console.error("Error destroying session:", err);
            res.status(500).json({ error: "Internal Server Error" });
        } else {
            res.json({ success: true });
        }
    });
});

module.exports = router;