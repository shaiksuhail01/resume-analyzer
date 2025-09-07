const pdf = require("pdf-parse");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

exports.analyzeResume = async (fileBuffer) => {
  const data = await pdf(fileBuffer);
  const resumeText = data.text || "";
  const truncated = resumeText.slice(0, 15000);

  const prompt = `
You are an expert technical recruiter and career coach. 
Analyze the following resume text and return ONLY a JSON object with the required fields.

Resume Text (truncated):
${truncated}

JSON Structure:
{
  "name": "...",
  "email": "...",
  "phone": "...",
  "linkedin_url": "...",
  "portfolio_url": "...",
  "summary": "...",
  "work_experience": [...],
  "education": [...],
  "technical_skills": [...],
  "soft_skills": [...],
  "projects": [...],
  "certifications": [...],
  "resume_rating": <number 1-10>,
  "improvement_areas": "...",
  "upskill_suggestions": [...]
}
`;

  try {
    const result = await model.generateContent(prompt);
    let text = result.response.text();

    // Remove backticks, smart quotes, invisible characters
    let cleanedText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .replace(/[‘’]/g, "'")
      .replace(/[“”]/g, '"')
      .replace(/[\u200B-\u200D\uFEFF]/g, "") // zero-width chars
      .trim();

    // Extract JSON object using balanced braces
    const extractJSON = (str) => {
      let stack = [];
      let startIndex = -1;
      for (let i = 0; i < str.length; i++) {
        if (str[i] === "{") {
          if (stack.length === 0) startIndex = i;
          stack.push("{");
        } else if (str[i] === "}") {
          stack.pop();
          if (stack.length === 0 && startIndex !== -1) {
            return str.slice(startIndex, i + 1);
          }
        }
      }
      return null;
    };

    const jsonStr = extractJSON(cleanedText);
    if (!jsonStr) throw new Error("No JSON found in Gemini output");

    const parsed = JSON.parse(jsonStr);
    return parsed;

  } catch (error) {
    console.error("Gemini analysis failed:", error);

    return {
      name: null,
      email: null,
      phone: null,
      linkedin_url: null,
      portfolio_url: null,
      summary: resumeText.split("\n").slice(0, 3).join(" ").trim(),
      work_experience: [],
      education: [],
      technical_skills: [],
      soft_skills: [],
      projects: [],
      certifications: [],
      resume_rating: 5,
      improvement_areas: "Provide clearer structure and quantifiable achievements.",
      upskill_suggestions: ["System Design", "Advanced React", "Data Structures"],
    };
  }
};
