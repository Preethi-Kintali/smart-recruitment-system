const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
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
        const { fullName, email, phone, jobId, userId } = req.body;
        
        if (!jobId || !mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({ message: 'Invalid or missing Job ID' });
        }

        let candidate = await Candidate.findOne({ email });
        if (candidate) {
            candidate.resumeUrl = req.file.path;
            if (userId) candidate.userId = userId;
            await candidate.save();
        } else {
            candidate = new Candidate({
                fullName, email, phone,
                userId: userId || null,
                skills: skills.split(','),
                experience, education,
                resumeUrl: req.file.path
            });
            await candidate.save();
        }

        const job = await Job.findById(jobId);
        if (!job) return res.status(404).json({ message: 'Job not found' });

        const existingApp = await Application.findOne({ jobId, candidateId: candidate._id });
        if (existingApp) return res.status(400).json({ message: 'You have already applied for this position.' });

        let resumeData = { skills: [], projects: [], experience: '', education: '' };
        if (req.file) {
            resumeData = await AIService.parseResume(req.file.path);
            candidate.skills = resumeData.skills || [];
            candidate.experience = resumeData.experience || '';
            candidate.education = resumeData.education || '';
            await candidate.save();
        }

        const atsResult = await AIService.calculateATSScore(resumeData, job);

        let ranking = 'Low Fit';
        if (atsResult.score >= 80) ranking = 'Best Fit';
        else if (atsResult.score >= 50) ranking = 'Average Fit';

        const application = new Application({
            jobId,
            candidateId: candidate._id,
            atsScore: atsResult.score,
            ranking,
            aiFeedback: {
                missingKeywords: atsResult.missingKeywords || [],
                suggestions: atsResult.suggestions || '',
                gapAnalysis: atsResult.gapAnalysis || ''
            },
            status: ranking === 'Best Fit' ? 'Screening' : 'Applied'
        });

        await application.save();

        try {
            await EmailService.sendApplicationReceived(candidate.email, candidate.fullName, job.title);
        } catch (err) {}

        res.status(201).json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get my applications (Candidate)
router.get('/my-applications', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ message: 'Unauthorized' });
        
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find all candidate records linked to this user ID
        const candidates = await Candidate.find({ userId: decoded.id });
        if (!candidates.length) return res.json([]);

        const candidateIds = candidates.map(c => c._id);
        const applications = await Application.find({ candidateId: { $in: candidateIds } })
            .populate('jobId')
            .sort({ appliedAt: -1 });
        res.json(applications);
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

// Update application status (Recruiter)
router.put('/:id/status', async (req, res) => {
    const { status } = req.body;
    try {
        const application = await Application.findById(req.params.id).populate('candidateId jobId');
        if (!application) return res.status(404).json({ message: 'Application not found' });

        if (req.body.interviewAnswers) {
            application.interviewAnswers = req.body.interviewAnswers;
            // Generate a simple AI report based on answers
            const answersArray = Object.values(req.body.interviewAnswers);
            const report = `Candidate demonstrated ${answersArray.length > 3 ? 'strong' : 'basic'} communication skills. Key technical mentions: ${answersArray.join(' ').substring(0, 100)}... The AI suggests they have a good grasp of the role requirements.`;
            application.interviewReport = report;

            // Send report to recruiter
            try {
                const User = require('../models/User');
                const recruiter = await User.findById(application.jobId.recruiterId);
                if (recruiter && recruiter.email) {
                    await EmailService.sendInterviewReport(
                        recruiter.email,
                        application.candidateId.fullName,
                        application.jobId.title,
                        report
                    );
                } else {
                    // Fallback to primary admin email if recruiter not found
                    await EmailService.sendInterviewReport(
                        process.env.EMAIL_USER,
                        application.candidateId.fullName,
                        application.jobId.title,
                        report
                    );
                }
            } catch (err) {
                console.error("Failed to send recruiter email:", err);
            }
        }

        application.status = status;

        if (status === 'Hired') {
            const PDFService = require('../services/pdf.service');
            const offerUrl = await PDFService.generateOfferLetter(
                application.candidateId.fullName,
                application.jobId.title,
                'SmartRecruit Partner',
                application.jobId.salary || 'Competitive'
            );
            application.offerLetterUrl = offerUrl;
            await EmailService.sendOfferLetter(
                application.candidateId.email,
                application.candidateId.fullName,
                application.jobId.title,
                `http://localhost:5000${offerUrl}`
            );
        } else if (status === 'Shortlisted') {
            await EmailService.sendShortlisted(
                application.candidateId.email,
                application.candidateId.fullName,
                application.jobId.title
            );
        } else if (status === 'Interview') {
            console.log(`[DEBUG] Sending Interview Invite to: ${application.candidateId.email}`);
            await EmailService.sendInterviewInvite(
                application.candidateId.email,
                application.candidateId.fullName,
                application.jobId.title,
                'http://localhost:5173/mock-interview/' + application._id
            );
        } else if (status === 'OfflineInterview') {
            const { date, place } = req.body;
            await EmailService.sendOfflineInterviewInvite(
                application.candidateId.email,
                application.candidateId.fullName,
                application.jobId.title,
                date,
                place
            );
        } else if (status === 'Rejected') {
            console.log(`[DEBUG] Sending Rejection to: ${application.candidateId.email}`);
            const rejectionReason = await AIService.generateRejectionReason(application.candidateId, application.jobId.title);
            await EmailService.sendRejection(application.candidateId.email, application.candidateId.fullName, application.jobId.title, rejectionReason);
        }

        await application.save();
        res.json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
