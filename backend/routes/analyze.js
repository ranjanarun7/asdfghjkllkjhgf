const express = require("express");
const { GoogleGenAI, Type } = require("@google/genai");
const Feedback = require("../models/feedback");

const router = express.Router();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

/* ---------------- GEMINI RESPONSE SCHEMA ---------------- */

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    detectedLanguage: { type: Type.STRING },
    sentimentLabel: { type: Type.STRING, enum: ["POSITIVE", "NEGATIVE", "NEUTRAL", "MIXED"] },
    sentimentScore: { type: Type.NUMBER },
    ratingInferred: { type: Type.NUMBER },
    categories: { type: Type.ARRAY, items: { type: Type.STRING } },
    safetyFlags: {
      type: Type.OBJECT,
      properties: {
        isSafetyIssue: { type: Type.BOOLEAN },
        isUrgent: { type: Type.BOOLEAN },
        notes: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["isSafetyIssue", "isUrgent", "notes"]
    },
    improvementSuggestionsSystem: { type: Type.ARRAY, items: { type: Type.STRING } },
    improvementSuggestionsVendor: { type: Type.ARRAY, items: { type: Type.STRING } },
    summaryForDashboard: { type: Type.STRING },
    shouldRaiseAlert: { type: Type.BOOLEAN },
    alertReason: { type: Type.STRING }
  },
  required: [
    "detectedLanguage",
    "sentimentLabel",
    "sentimentScore",
    "categories",
    "safetyFlags",
    "summaryForDashboard",
    "shouldRaiseAlert"
  ]
};

/* ---------------- API ROUTE ---------------- */

router.post('/', async (req, res) => {
  try {
    const feedback = req.body;

    const prompt = `
    Analyze tourism feedback:

    Target: ${feedback.targetName}
    Type: ${feedback.targetType}
    Rating: ${feedback.rating ?? 'N/A'}
    Comment: "${feedback.comment}"

    Return structured JSON output only.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        systemInstruction: "Tourism AI Analyst",
        temperature: 0.1,
      }
    });

    const raw = response.text;
    if (!raw) throw new Error("Gemini returned empty response");

    const result = JSON.parse(raw);
    return res.json(result);
  } catch (err) {
    console.error("Gemini error:", err);
    res.status(500).json({ error: "Gemini analysis failed" });
  }
});

module.exports = router;
