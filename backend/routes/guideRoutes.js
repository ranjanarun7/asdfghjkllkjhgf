const express = require("express");
const multer = require("multer");
const Guide = require("../models/Guide");
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

router.post("/apply", upload.single("document"), async (req, res) => {
  console.log("BODY:", req.body);
  console.log("FILE:", req.file);
  const newGuide = new Guide({
    userId: req.body.userId,
    name: req.body.name,
    region: req.body.region,
    language: req.body.language,
    document: req.file.filename,
    status: "pending",
  });
  await newGuide.save();
  res.json({ success: true });
});

// Admin list
router.get("/", async (req, res) => {
  const guides = await Guide.find();
  res.json(guides);
});

// Approve Guide
router.put("/approve/:id", async (req, res) => {
  await Guide.findByIdAndUpdate(req.params.id, { status: "approved" });
  res.json({ approved: true });
});

router.get("/status/:userId", async (req, res) => {
  const guide = await Guide.findOne({ userId: req.params.userId });
  res.json(guide);
});


module.exports = router;
