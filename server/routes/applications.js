const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Application = require('../models/Application');
const Candidate = require('../models/Candidate');
const Job = require('../models/Job');
const EmailService = require('../services/email.service');
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
        const { fullName, email, phone, jobId } = req.body;
        
        // 1. Check for Duplicate Candidate (Email or Phone)
        let candidate = await Candidate.findOne({ $or: [{ email }, { phone }] });
        if (candidate) {
            // Update existing candidate info if provided
            if (fullName) candidate.fullName = fullName;
            if (req.file) candidate.resumeUrl = req.file.path;
            await candidate.save();
        } else {
            candidate = new Candidate({
                fullName, email, phone,
                resumeUrl: req.file ? req.file.path : ''
            });
            await candidate.save();
        }

        // 2. Fetch Job Details
        const job = await Job.findById(jobId);
        if (!job) return res.status(404).json({ message: 'Job not found' });

        // 3. Check if already applied for this specific job
        const existingApp = await Application.findOne({ jobId, candidateId: candidate._id });
        if (existingApp) {
            return res.status(400).json({ message: 'You have already applied for this position.' });
        }

        // 4. Real AI Parsing & Scoring
        let resumeData = { skills: [], projects: [], experience: '', education: '' };
        if (req.file) {
            resumeData = await AIService.parseResume(req.file.path);
            // Update candidate with parsed data
            candidate.skills = resumeData.skills;
            candidate.projects = resumeData.projects;
            candidate.experience = resumeData.experience;
            candidate.education = resumeData.education;
            candidate.certifications = resumeData.certifications;
            await candidate.save();
        }

        const atsResult = await AIService.calculateATSScore(resumeData, job);

        // 5. Auto Ranking
        let ranking = 'Low Fit';
        if (atsResult.score >= 80) ranking = 'Best Fit';
        else if (atsResult.score >= 50) ranking = 'Average Fit';

        // 6. Create Application
        const application = new Application({
            jobId,
            candidateId: candidate._id,
            atsScore: atsResult.score,
            ranking,
            aiFeedback: {
                missingKeywords: atsResult.missingKeywords,
                suggestions: atsResult.suggestions,
                gapAnalysis: atsResult.gapAnalysis
            },
            status: ranking === 'Best Fit' ? 'Screening' : 'Applied'
        });

        await application.save();

        // 7. Always-On Module: Email Automation
        await EmailService.sendApplicationReceived(candidate.email, candidate.fullName, job.title);

        // 8. Auto Rejection if Score is too low (Step 6 Decision Gate)
        if (atsResult.score < 30) {
            const rejectionReason = await AIService.generateRejectionReason(resumeData, job.title);
            application.status = 'Rejected';
            await application.save();
            await EmailService.sendRejection(candidate.email, candidate.fullName, job.title, rejectionReason);
        }

        res.status(201).json(application);
    } catch (error) {
        console.error("Application Error:", error);
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
