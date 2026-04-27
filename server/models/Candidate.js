const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    education: { type: String },
    skills: [{ type: String }],
    experience: { type: String },
    projects: [{ type: String }],
    certifications: [{ type: String }],
    resumeUrl: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Candidate', candidateSchema);
