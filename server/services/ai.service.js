const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');
const fs = require('fs');
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const MODEL_NAME = "gemini-1.5-flash";

class AIService {
  async generateJD(title, skills, experience) {
    fs.appendFileSync('ai_debug.log', `[${new Date().toISOString()}] Generating JD for: ${title}\n`);
    try {
      const model = genAI.getGenerativeModel({ model: MODEL_NAME });
      const prompt = `Generate a professional job description for the role: ${title}. 
      Required skills: ${skills}. 
      Experience level: ${experience}. 
      Include Overview, Responsibilities, and Requirements sections in Markdown format.`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      fs.appendFileSync('ai_debug.log', `[${new Date().toISOString()}] JD Error: ${error.message}\n`);
      return `Default JD for ${title}... (AI failed: ${error.message})`;
    }
  }

  async parseResume(filePath) {
    fs.appendFileSync('ai_debug.log', `[${new Date().toISOString()}] Parsing Resume: ${filePath}\n`);
    try {
      const dataBuffer = new Uint8Array(fs.readFileSync(filePath));
      const { PDFParse } = require('pdf-parse');
      const data = await new PDFParse(dataBuffer);
      const pdfResult = await data.getText();
      const text = pdfResult.text;

      if (!text || typeof text !== 'string' || text.trim().length === 0) {
        throw new Error("Extracted text is empty or not a string");
      }

      const model = genAI.getGenerativeModel({ model: MODEL_NAME });
      const prompt = `Extract the following details from this resume text. 
      IMPORTANT: Look for skills in sections like "Technical Skills", "Key Skills", "Core Competencies", or "Technologies".
      
      Resume Text: ${text}

      Return ONLY a JSON object with:
      - skills: (array of strings)
      - projects: (array of strings)
      - education: (string)
      - experience: (string)
      - certifications: (array of strings)`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let cleanedText = response.text().replace(/```json|```/g, "").trim();
      return JSON.parse(cleanedText);
    } catch (error) {
      fs.appendFileSync('ai_debug.log', `[${new Date().toISOString()}] Parsing Error: ${error.message}\n`);
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
    fs.appendFileSync('ai_debug.log', `[${new Date().toISOString()}] Calculating ATS Score for: ${job.title}\n`);
    try {
      const model = genAI.getGenerativeModel({ model: MODEL_NAME });
      const prompt = `Compare this candidate resume data with the job description.
      Candidate Skills found: ${resumeData.skills.join(', ')}
      Candidate Projects: ${resumeData.projects.join(', ')}
      Job Title: ${job.title}
      Required Skills: ${job.skills.join(', ')}
      
      Respond ONLY with a valid JSON object.
      Analyze the candidate's technical proficiency and match it against the required skills.
      JSON structure:
      {
        "score": (number 0-100),
        "missingKeywords": (array of strings),
        "suggestions": (string),
        "gapAnalysis": (string)
      }`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text().trim();
      
      // Extract JSON block if it exists
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        text = jsonMatch[0];
      }

      try {
        return JSON.parse(text);
      } catch (e) {
        // Fallback for minor JSON errors like trailing commas
        const cleaned = text.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
        return JSON.parse(cleaned);
      }
    } catch (error) {
      fs.appendFileSync('ai_debug.log', `[${new Date().toISOString()}] ATS Score Error: ${error.message}\n`);
      return { 
        score: 0, 
        missingKeywords: [], 
        suggestions: "AI Service Error: " + error.message, 
        gapAnalysis: "Could not complete analysis." 
      };
    }
  }

  async generateRejectionReason(resumeData, jobTitle) {
    try {
      const model = genAI.getGenerativeModel({ model: MODEL_NAME });
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
      const model = genAI.getGenerativeModel({ model: MODEL_NAME });
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
      return {
        technical: ["Explain your core stack."],
        hr: ["Why this company?"],
        projectBased: ["Describe your best project."]
      };
    }
  }
}

module.exports = new AIService();
