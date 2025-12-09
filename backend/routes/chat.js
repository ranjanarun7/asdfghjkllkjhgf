const express = require("express");
const router = express.Router();
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

router.post("/", async (req, res) => {
  try {

    const { message, language, history = [] } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY not found in .env");
    }
    const chat = await ai.chats.create({
      model: "gemini-2.5-flash",
      history: history.map(m => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }]
      }))
    });

    const langInstruction =
      language && language !== "English"
        ? ` Respond in ${language}.`
        : "";

    const result = await chat.sendMessage({
      message: message + langInstruction
    });

    const reply = result.text;

    res.json({ reply });

  } catch (error) {
    console.error("💥 FULL GEMINI ERROR:", error);
    res.status(500).json({
      error: error.message || "Gemini crash"
    });
  }
});

module.exports = router;
