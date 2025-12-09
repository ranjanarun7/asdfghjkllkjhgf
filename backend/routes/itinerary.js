const express = require("express");
const { generateItineraryServer } = require("../services/gemini");
const Itinerary = require("../models/Itinerary");

const router = express.Router();

router.post("/generate", async (req, res) => {
  try {
    const text = await generateItineraryServer(req.body);

    if (!text || !text.trim().startsWith("{")) {
      return res.status(500).json({
        error: "Gemini did not return JSON",
        raw: text
      });
    }

    const parsed = JSON.parse(text);

    res.json({ success: true, data: parsed });

  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/save", async (req, res) => {
  try {
    const { itineraryData, userId, start_city } = req.body;

    if (!userId || !itineraryData) {
      return res.status(400).json({ error: "Missing data" });
    }

    const title = itineraryData.itinerary?.[0]?.title || "My Trip";
    const startDate = itineraryData.itinerary?.[0]?.date;
    const days = itineraryData.itinerary?.length || 0;

    const cities = [
      start_city,
      ...(itineraryData.itinerary || []).flatMap(day =>
        day.items.map(item => item.place_name)
      )
    ];

    const saved = await Itinerary.create({
      userId,
      title,
      startDate,
      days,
      cities,
      status: "completed",
      thumbnail: "",
      full_itinerary: itineraryData
    });

    res.json({ success: true, saved_id: saved._id });

  } catch (err) {
    console.error("SAVE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});



router.get("/history/:userId", async (req, res) => {
  try {
    const data = await Itinerary.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const deleted = await Itinerary.findByIdAndDelete(req.params.id);

    if (!deleted) {
      console.log("NOT FOUND IN DB");
      return res.json({ success: false, error: "Not found" });
    }

    console.log("DELETED SUCCESSFULLY");
    res.json({ success: true });

  } catch (err) {
    console.error("DELETE ERROR:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});





module.exports = router;
