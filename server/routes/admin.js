const express = require('express');
const router = express.Router();
const User = require('../models/User');
const RecruiterProfile = require('../models/RecruiterProfile');
const CandidateProfile = require('../models/CandidateProfile');
const Application = require('../models/Application');
const authMiddleware = require('../middleware/authMiddleware');

// Get all recruiters
router.get('/recruiters', authMiddleware(['admin']), async (req, res) => {
  try {
    const recruiters = await User.find({ role: 'recruiter' }).select('-password');
    const profiles = await RecruiterProfile.find();
    
    // Merge user status with profile details
    const merged = recruiters.map(u => {
      const profile = profiles.find(p => p.userId.toString() === u._id.toString());
      return {
        ...u._doc,
        companyName: profile?.companyName,
        companyEmail: profile?.companyEmail,
        designation: profile?.designation
      };
    });
    
    res.json(merged);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update recruiter status
router.put('/recruiter/:id/status', authMiddleware(['admin']), async (req, res) => {
  const { status } = req.body; // 'approved', 'rejected', 'blocked', 'active'
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.status = status;
    await user.save();

    // Update profile approval status if approved
    if (status === 'approved' || status === 'active') {
      await RecruiterProfile.findOneAndUpdate({ userId: user._id }, { isApproved: true });
    }

    res.json({ message: `Recruiter status updated to ${status}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// System Stats
router.get('/stats', authMiddleware(['admin']), async (req, res) => {
  try {
    const [totalRecruiters, totalCandidates, totalApplications, hiredCount] = await Promise.all([
      User.countDocuments({ role: 'recruiter' }),
      User.countDocuments({ role: 'candidate' }),
      Application.countDocuments(),
      Application.countDocuments({ status: 'Hired' })
    ]);

    res.json({
      totalRecruiters,
      totalCandidates,
      totalApplications,
      totalHired: hiredCount,
      conversionRate: totalApplications > 0 ? ((hiredCount / totalApplications) * 100).toFixed(2) : 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
