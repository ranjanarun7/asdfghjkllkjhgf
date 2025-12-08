const express = require("express");
const multer = require("multer");
const Guide = require("../models/Guide");
const { recordTransaction } = require("../services/ledgerService");
const router = express.Router();
const User = require("../models/userModel");

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

// Verified Guides List
router.get("/verified", async (req, res) => {
  const guides = await Guide.find({ status: "approved" });

  const guidesWithAvatar = await Promise.all(
    guides.map(async (guide) => {
      const user = await User.findById(guide.userId);
      return {
        ...guide.toObject(),
        avatar: user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde", // Fallback
      };
    })
  );

  res.json(guidesWithAvatar);
});

// Admin list
router.get("/", async (req, res) => {
  const guides = await Guide.find();
  res.json(guides);
});

// Approve Guide
router.put("/approve/:id", async (req, res) => {
  await Guide.findByIdAndUpdate(req.params.id, { status: "approved" });

  // Record on Chain
  recordTransaction({
    type: 'GUIDE_VERIFY',
    guideId: req.params.id,
    status: 'Verified',
    verifiedAt: new Date().toISOString()
  });

  res.json({ approved: true });
});

// Unverify Guide
router.put("/unverify/:id", async (req, res) => {
  await Guide.findByIdAndUpdate(req.params.id, { status: "pending" });

  // Record on Chain
  recordTransaction({
    type: 'GUIDE_UNVERIFY',
    guideId: req.params.id,
    status: 'Unverified',
    unverifiedAt: new Date().toISOString()
  });

  res.json({ unverified: true });
});

router.get("/status/:userId", async (req, res) => {
  const guide = await Guide.findOne({ userId: req.params.userId });
  res.json(guide);
});


module.exports = router;
