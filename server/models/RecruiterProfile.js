const mongoose = require('mongoose');

const RecruiterProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyName: { type: String, required: true },
  companyEmail: { type: String, required: true },
  companyType: { type: String },
  designation: { type: String },
  phoneNumber: { type: String },
  isApproved: { type: Boolean, default: false }
});

module.exports = mongoose.model('RecruiterProfile', RecruiterProfileSchema);
