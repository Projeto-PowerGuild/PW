// Import required modules
const express = require('express');
const Platform = require('../models/platformsModel'); // Assuming you have a Platform model

// Create Express router
const router = express.Router();

// Define route for /platforms endpoint to get all platforms
router.get('/', async (req, res) => {
    try {
        const platforms = await Platform.getAll();
        res.json(platforms);
    } catch (error) {
        console.error("Error fetching platforms:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;