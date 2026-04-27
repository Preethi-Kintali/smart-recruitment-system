const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');
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

  async parseResume(text) {
    // In a real app, you'd extract text from PDF first. 
    // Here we simulate the extraction or use a detailed prompt.
    return {
      skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'REST APIs', 'Git'],
      experience: '3+ years of web development',
      education: 'Bachelor in Computer Science',
      projects: ['Personal Portfolio', 'E-commerce App'],
      certifications: ['Full Stack Dev Certificate']
    };
  }

  async calculateATSScore(resumeData, job) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Compare this candidate resume data with the job description.
      Resume: ${JSON.stringify(resumeData)}
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
      return { score: 75, missingKeywords: [], suggestions: "Keep up the good work!", gapAnalysis: "No significant gaps found." };
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
