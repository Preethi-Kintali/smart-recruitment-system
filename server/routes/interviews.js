const express = require('express');
const router = express.Router();
const Interview = require('../models/Interview');
const Application = require('../models/Application');
const AIService = require('../services/ai.service');
const EmailService = require('../services/email.service');

// Schedule Interview & Generate AI Questions
router.post('/schedule', async (req, res) => {
    try {
        const { applicationId, date, time, mode } = req.body;
        
        const app = await Application.findById(applicationId).populate('jobId candidateId');
        if (!app) return res.status(404).json({ message: 'Application not found' });

        // Generate AI Questions
        const questions = await AIService.generateInterviewQuestions(app.jobId.title, app.candidateId);

        const interview = new Interview({
            applicationId,
            date,
            time,
            mode,
            questions,
            meetingLink: mode === 'Online' ? 'https://meet.google.com/abc-defg-hij' : 'Office Headquarters'
        });

        await interview.save();
        
        // Update application status
        app.status = 'Interview';
        await app.save();

        // Send Email Invite
        await EmailService.sendInterviewInvite(
            app.candidateId.email, 
            app.candidateId.fullName, 
            app.jobId.title, 
            date, 
            time, 
            mode, 
            interview.meetingLink
        );

        res.status(201).json(interview);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Submit Feedback
router.post('/feedback', async (req, res) => {
    try {
        const { interviewId, rating, comments, decision } = req.body;
        const interview = await Interview.findById(interviewId);
        if (!interview) return res.status(404).json({ message: 'Interview not found' });

        interview.feedback = { rating, comments };
        await interview.save();

        // Update application status based on decision
        const app = await Application.findById(interview.applicationId);
        app.status = decision; // 'Selected', 'Rejected', or 'On Hold'
        await app.save();

        res.json({ message: `Candidate ${decision} successfully` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
