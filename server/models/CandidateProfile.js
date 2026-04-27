const mongoose = require('mongoose');

const CandidateProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  phone: { type: String },
  education: { type: String },
  skills: [String],
  experience: { type: String },
  resumeUrl: { type: String },
  parsedResume: { type: Object }
});

module.exports = mongoose.model('CandidateProfile', CandidateProfileSchema);
