const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional for guest apply
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  resumeUrl: { type: String },
  skills: [String],
  projects: [String],
  experience: { type: String },
  education: { type: String },
  certifications: [String],
  appliedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Candidate', CandidateSchema);
