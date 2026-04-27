const mongoose = require('mongoose');
const User = require('./models/User');
const Application = require('./models/Application');
const Candidate = require('./models/Candidate');
const dotenv = require('dotenv');
dotenv.config();

async function clearApp() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const user = await User.findOne({ email: 'preethikinthali1508@gmail.com' });
    if (!user) {
      console.log('User not found');
      return;
    }
    
    const candidate = await Candidate.findOne({ userId: user._id });
    if (!candidate) {
        console.log('Candidate profile not found');
    }

    const result = await Application.deleteMany({ 
        $or: [
            { candidateId: candidate?._id },
            { email: 'preethikinthali1508@gmail.com' }
        ]
    });
    console.log(`Deleted ${result.deletedCount} applications for ${user.email}`);
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

clearApp();
