const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');
const pdf = require('pdf-parse');
const fs = require('fs');
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

class AIService {
  async generateJD(title, skills, experience) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Generate a professional job description for the role: ${title}. 
      Required skills: ${skills}. 
      Experience level: ${experience}. 
      Include Overview, Responsibilities, and Requirements sections in Markdown format.`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("AI JD Generation Error:", error);
      return `Default JD for ${title}... (AI failed)`;
    }
  }

  async parseResume(filePath) {
    try {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdf(dataBuffer);
      const text = data.text;

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Extract the following details from this resume text:
      - skills (array of strings)
      - projects (array of strings)
      - education (string)
      - experience (string)
      - certifications (array of strings)
      
      Resume Text: ${text}
      
      Provide a valid JSON response only.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let cleanedText = response.text().replace(/```json|```/g, "").trim();
      return JSON.parse(cleanedText);
    } catch (error) {
      console.error("AI Resume Parsing Error:", error);
      return {
        skills: [],
        projects: [],
        education: 'Not specified',
        experience: 'Not specified',
        certifications: []
      };
    }
  }

  async calculateATSScore(resumeData, job) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Compare this candidate resume data with the job description.
      Resume Data: ${JSON.stringify(resumeData)}
      Job: ${job.title}, Skills Required: ${job.skills.join(', ')}
      
      Provide a JSON response with:
      - score: (number 0-100)
      - missingKeywords: (array of strings)
      - suggestions: (string)
      - gapAnalysis: (string)`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text().replace(/```json|```/g, "").trim();
      return JSON.parse(text);
    } catch (error) {
      console.error("AI ATS Scoring Error:", error);
      return { score: 0, missingKeywords: [], suggestions: "Could not analyze resume.", gapAnalysis: "Error in analysis." };
    }
  }

  async generateRejectionReason(resumeData, jobTitle) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Generate a professional, polite, and constructive rejection reason for a candidate who applied for ${jobTitle} but was not selected.
      Candidate Data: ${JSON.stringify(resumeData)}
      Keep it brief and encouraging.`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      return "Your profile does not currently match our specific requirements for this role.";
    }
  }

  async generateInterviewQuestions(jobTitle, resumeData) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Generate interview questions for a candidate applying for ${jobTitle}.
      Candidate Resume: ${JSON.stringify(resumeData)}
      
      Provide:
      - 3 Technical questions based on their skills
      - 2 HR questions
      - 2 Project-based questions
      
      Format as JSON with keys: technical, hr, projectBased (each as array of strings).`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text().replace(/```json|```/g, "").trim();
      return JSON.parse(text);
    } catch (error) {
      console.error("AI Question Generation Error:", error);
      return {
        technical: ["Explain your core stack."],
        hr: ["Why this company?"],
        projectBased: ["Describe your best project."]
      };
    }
  }
}

module.exports = new AIService();
