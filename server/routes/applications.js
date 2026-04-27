const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Application = require('../models/Application');
const Candidate = require('../models/Candidate');
const Job = require('../models/Job');
const AIService = require('../services/ai.service');

// Configure Multer for resume uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Submit Application
router.post('/', upload.single('resume'), async (req, res) => {
    try {
        const { fullName, email, phone, jobId, skills, experience, education } = req.body;
        
        // 1. Check for Duplicate Candidate
        let candidate = await Candidate.findOne({ email });
        if (!candidate) {
            candidate = new Candidate({
                fullName, email, phone, education, skills: skills.split(','), experience,
                resumeUrl: req.file ? req.file.path : ''
            });
            await candidate.save();
        }

        // 2. Fetch Job Details for Scoring
        const job = await Job.findById(jobId);
        if (!job) return res.status(404).json({ message: 'Job not found' });

        // 3. AI Parsing & Scoring (Simulated)
        const resumeData = await AIService.parseResume(''); // In real app, pass file text
        const atsResult = await AIService.calculateATSScore(resumeData, job);

        // 4. Auto Ranking
        let ranking = 'Low Fit';
        if (atsResult.score >= 80) ranking = 'Best Fit';
        else if (atsResult.score >= 50) ranking = 'Average Fit';

        // 5. Create Application
        const application = new Application({
            jobId,
            candidateId: candidate._id,
            atsScore: atsResult.score,
            ranking,
            aiFeedback: {
                missingKeywords: atsResult.missingKeywords,
                suggestions: atsResult.suggestions
            },
            status: ranking === 'Best Fit' ? 'Screening' : 'Applied'
        });

        await application.save();
        res.status(201).json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get applications for a specific job (Recruiter)
router.get('/job/:jobId', async (req, res) => {
    try {
        const applications = await Application.find({ jobId: req.params.jobId })
            .populate('candidateId')
            .sort({ atsScore: -1 });
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
