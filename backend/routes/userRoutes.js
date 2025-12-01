const express = require("express");
const User = require("../models/userModel");
const router = express.Router();

// ✅ Update profile
router.put("/:id", async (req, res) => {
  try {
    const { name, email, phone, location, bio, avatar, coverPhoto } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, location, bio, avatar, coverPhoto },
      { new: true }
    );

    if (!updatedUser) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      message: "Profile updated",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        location: updatedUser.location,
        bio: updatedUser.bio,
        avatar: updatedUser.avatar,
        coverPhoto: updatedUser.coverPhoto,
        isAdmin: updatedUser.isAdmin
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ GET USER FOR REFRESH
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});


module.exports = router;