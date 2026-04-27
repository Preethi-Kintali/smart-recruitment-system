const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const AIService = require('../services/ai.service');

// Create a new job
router.post('/', async (req, res) => {
    try {
        const job = new Job(req.body);
        await job.save();
        res.status(201).json(job);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all jobs
router.get('/', async (req, res) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Generate JD via AI
router.post('/generate-jd', async (req, res) => {
    const { title, skills, experience } = req.body;
    try {
        const jd = await AIService.generateJD(title, skills, experience);
        res.json({ description: jd });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
