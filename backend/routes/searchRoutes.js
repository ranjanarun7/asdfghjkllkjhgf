const express = require("express");
const router = express.Router();
const Place = require("../models/placeModel");

router.get("/", async (req, res) => {
  const q = req.query.q;

  if (!q) return res.json([]);

  const results = await Place.find({
    name: { $regex: q, $options: "i" }
  }).limit(10);

  res.json({ results });
});

module.exports = router;
