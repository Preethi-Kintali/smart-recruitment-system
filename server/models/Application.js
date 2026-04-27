const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },
    status: { 
        type: String, 
        enum: ['Applied', 'Screening', 'Interview', 'Selected', 'Rejected', 'On Hold'], 
        default: 'Applied' 
    },
    atsScore: { type: Number, default: 0 },
    ranking: { type: String, enum: ['Best Fit', 'Average Fit', 'Low Fit'], default: 'Low Fit' },
    aiFeedback: {
        missingKeywords: [{ type: String }],
        suggestions: { type: String },
        gapAnalysis: { type: String }
    },
    appliedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Application', applicationSchema);
