const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
    applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    mode: { type: String, enum: ['Online', 'In-Person'], default: 'Online' },
    meetingLink: { type: String },
    questions: {
        technical: [{ type: String }],
        hr: [{ type: String }],
        projectBased: [{ type: String }]
    },
    feedback: {
        rating: { type: Number, min: 1, max: 5 },
        comments: { type: String }
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Interview', interviewSchema);
