const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  try {
    const result = await genAI.listModels();
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(error.message);
  }
}

listModels();
