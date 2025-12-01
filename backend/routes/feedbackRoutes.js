const express = require("express");
const Feedback = require ('../models/feedback');
const User = require("../models/userModel");
const axios = require("axios");
const router = express.Router();

/* CREATE FEEDBACK */
router.post('/', async (req, res) => {
  try {
    const data = await Feedback.create(req.body);
axios.post("http://localhost:5000/api/analyze", data);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save feedback' });
  }
});

/* GET ALL FEEDBACK */
router.get('/', async (req, res) => {
  const feedback = await Feedback.find().sort({ createdAt: -1 });

  for (let f of feedback) {
    if (f.userId) {
      const user = await User.findById(f.userId);
      f._doc.userName = user?.name || "Guest User";
    }
  }

  res.json(feedback);
});

/* SAVE ANALYSIS */
router.put('/:id/analyze', async (req, res) => {
  const updated = await Feedback.findByIdAndUpdate(
    req.params.id,
    { status: 'analyzed', analysis: req.body },
    { new: true }
  );
  res.json(updated);
});

module.exports = router;
