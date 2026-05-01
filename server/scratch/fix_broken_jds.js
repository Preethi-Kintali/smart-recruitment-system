const mongoose = require('mongoose');
const Job = require('../models/Job');
const AIService = require('../services/ai.service');
const dotenv = require('dotenv');
dotenv.config();

async function fixJobs() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const brokenJobs = await Job.find({ 
            description: { $regex: /\(AI failed/ } 
        });

        console.log(`Found ${brokenJobs.length} jobs with broken descriptions.`);

        for (const job of brokenJobs) {
            console.log(`Regenerating JD for: ${job.title}...`);
            const skillsStr = job.skills ? job.skills.join(', ') : '';
            const newDescription = await AIService.generateJD(job.title, skillsStr, job.experience);
            
            if (!newDescription.includes('(AI failed')) {
                job.description = newDescription;
                await job.save();
                console.log(`Successfully updated: ${job.title}`);
            } else {
                console.log(`Failed to regenerate for: ${job.title} - AI still failing.`);
            }
        }

        console.log('Done.');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

fixJobs();
