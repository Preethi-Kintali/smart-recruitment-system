const mongoose = require('mongoose');
const Application = require('./models/Application');
const dotenv = require('dotenv');
dotenv.config();

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  const apps = await Application.find();
  console.log('Total Apps:', apps.length);
  apps.forEach(a => console.log(`App for: ${a.fullName} (${a.email}) - Job: ${a.jobId}`));
  process.exit(0);
}
check();
