const express = require("express");
const multer = require("multer");
const Guide = require("../models/Guide");
const User = require("../models/userModel");


const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

router.post("/apply", upload.single("document"), async (req, res) => {
  try {
    const { userId, name, region, language } = req.body;
    const document = req.file?.filename;

    const app = await Guide.create({
      userId,
      name,
      region,
      language,
      document,   
      status: "pending",
    });

    return res.json({ success: true, application: app });
  } catch (err) {
    console.error(err);
    return res.json({ success: false, message: "Server error" });
  }
});

router.get("/status/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const app = await Guide.findOne({ userId }).lean();

    if (!app) {
      return res.json({ success: true, guide: null });
    }

    return res.json({
      success: true,
      guide: {
        status: app.status,
        documentVerified: app.documentVerified,
        interviewScheduled: app.interviewScheduled,
        interviewCenter: app.interviewCenter,
        interviewDate: app.interviewDate,
        interviewCleared: app.interviewCleared,
        agreementSigned: app.agreementSigned,
      },
    });
  } catch (err) {
    console.error(err);
    return res.json({ success: false, message: "Server error" });
  }
});

router.put("/:id/verify-document", async (req, res) => {
  try {
    const guide = await Guide.findByIdAndUpdate(
      req.params.id,
      { documentVerified: true },
      { new: true }
    );
    res.json({ success: true, guide });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.put("/:id/schedule-interview", async (req, res) => {
  try {
    const { interviewCenter, interviewDate } = req.body; // date string

    const guide = await Guide.findByIdAndUpdate(
      req.params.id,
      {
        interviewScheduled: true,
        interviewCenter,
        interviewDate,
      },
      { new: true }
    );

    res.json({ success: true, guide });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.put("/:id/mark-interview", async (req, res) => {
  try {
    const { cleared } = req.body; // true / false

    const guide = await Guide.findByIdAndUpdate(
      req.params.id,
      { interviewCleared: cleared },
      { new: true }
    );

    res.json({ success: true, guide });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.put("/:id/sign-agreement", async (req, res) => {
  try {
    const guide = await Guide.findByIdAndUpdate(
      req.params.id,
      { agreementSigned: true, status: "approved" },
      { new: true }
    );

    if (guide) {
      await User.findByIdAndUpdate(guide.userId, {
        $set: { isGuideVerified: true },
      });
    }

    res.json({ success: true, guide });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.put("/approve/:id", async (req, res) => {
  try {
    const guide = await Guide.findByIdAndUpdate(
      req.params.id,
      { status: "approved", agreementSigned: true },
      { new: true }
    );

    if (guide) {
      await User.findByIdAndUpdate(guide.userId, {
        $set: { isGuideVerified: true },
      });
    }

    res.json({ approved: true, guide });
  } catch (err) {
    console.error(err);
    res.status(500).json({ approved: false });
  }
});

router.get("/all", async (req, res) => {
  const apps = await GuideApplication.find().populate("userId");
  res.json(apps);
});

module.exports = router;
