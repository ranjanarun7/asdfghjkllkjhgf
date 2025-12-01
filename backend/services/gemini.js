const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const { SYSTEM_INSTRUCTION } = require("../constants");
dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateItineraryServer(input) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const result = await model.generateContent({
    contents: [{
      role: "user",
      parts: [{
        text: `
${SYSTEM_INSTRUCTION}

STRICT RULES:
✅ Return ONLY JSON
✅ Must follow schema strictly
✅ Must include "itinerary" array
✅ No explanation / no markdown / no extra text

INPUT:
${JSON.stringify(input, null, 2)}
        `
      }]
    }],
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.3
    }
  });

  return result.response.text();
}

module.exports = { generateItineraryServer };
