const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const RecruiterProfile = require('../models/RecruiterProfile');
const CandidateProfile = require('../models/CandidateProfile');
const authMiddleware = require('../middleware/authMiddleware');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// Recruiter Signup
router.post('/signup/recruiter', async (req, res) => {
  const { name, email, password, companyName, companyEmail, companyType, designation, phoneNumber } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const user = new User({ name, email, password, role: 'recruiter', status: 'pending' });
    await user.save();

    const profile = new RecruiterProfile({
      userId: user._id,
      companyName,
      companyEmail,
      companyType,
      designation,
      phoneNumber
    });
    await profile.save();

    res.status(201).json({ message: 'Registration successful. Waiting for Admin approval.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Candidate Signup
router.post('/signup/candidate', async (req, res) => {
  const { name, email, password, phone } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const user = new User({ name, email, password, role: 'candidate', status: 'active' });
    await user.save();

    const profile = new CandidateProfile({ userId: user._id, phone });
    await profile.save();

    res.status(201).json({
      token: generateToken(user),
      user: { id: user._id, name: user.name, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    if (user.role === 'recruiter' && user.status === 'pending') {
      return res.status(403).json({ message: 'Your account is pending approval.' });
    }
    if (user.status === 'rejected' || user.status === 'blocked') {
      return res.status(403).json({ message: 'Your account has been restricted.' });
    }

    res.json({
      token: generateToken(user),
      user: { id: user._id, name: user.name, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/profile', authMiddleware(), async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    let profileData = {};
    
    if (user.role === 'candidate') {
      const Candidate = require('../models/Candidate');
      profileData = await Candidate.findOne({ userId: user._id });
    } else if (user.role === 'recruiter') {
      const RecruiterProfile = require('../models/RecruiterProfile');
      profileData = await RecruiterProfile.findOne({ userId: user._id });
    }
    
    res.json({ user, profileData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
