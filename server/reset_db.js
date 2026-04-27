const mongoose = require('mongoose');
const User = require('./models/User');
const Candidate = require('./models/Candidate');
const Application = require('./models/Application');
const dotenv = require('dotenv');
dotenv.config();

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  const user = await User.findOne({ email: 'preethikinthali1508@gmail.com' });
  console.log('User:', user?._id);
  
  const candidates = await Candidate.find();
  console.log('Candidates count:', candidates.length);
  candidates.forEach(c => console.log(`Candidate userId: ${c.userId}`));

  const result = await Application.deleteMany({});
  console.log('DELETED ALL APPLICATIONS');
  
  process.exit(0);
}
check();
