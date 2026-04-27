const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const { generateOfferLetter } = require('../utils/pdfGenerator');

router.post('/finalize', async (req, res) => {
    try {
        const { applicationId, decision, salary, startDate } = req.body;
        const app = await Application.findById(applicationId).populate('candidateId jobId');
        
        if (!app) return res.status(404).json({ message: 'Application not found' });

        app.status = decision;
        await app.save();

        let offerUrl = null;
        if (decision === 'Selected') {
            offerUrl = await generateOfferLetter(
                app.candidateId.fullName, 
                app.jobId.title, 
                salary || '$80,000', 
                startDate || 'Next Monday'
            );
        }

        // In a real app, you'd trigger an email here using Nodemailer
        console.log(`Email Triggered: Status updated to ${decision} for ${app.candidateId.email}`);

        res.json({ 
            message: `Candidate ${decision} successfully`,
            offerPath: offerUrl ? `/uploads/${offerUrl.split('\\').pop()}` : null
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
