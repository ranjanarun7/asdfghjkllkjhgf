const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const router = express.Router();

// SIGNUP
router.post("/signup", async (req, res) => {
  const { name, email, password, phone, location, bio, coverPhoto, avatar } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    return res.json({ success: false, message: "User already exists" });
  }

  const hashed = await bcrypt.hash(password, 10);

  const newUser = new User({
    name,
    email,
    password: hashed,
    phone,
    location,
    bio,
    avatar:
      avatar ||
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
    coverPhoto:
      coverPhoto ||
      "https://images.unsplash.com/photo-1626246473523-289552cb874a?q=80&w=1600&auto=format&fit=crop",
    isAdmin: false
  });

  await newUser.save();

  res.json({ success: true, message: "Signup successful!" });
});


// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.json({ success: false, message: "User not found" });

  const checkPass = await bcrypt.compare(password, user.password);
  if (!checkPass)
    return res.json({ success: false, message: "Incorrect password" });

  const token = jwt.sign({ id: user._id }, "SECRET123", { expiresIn: "7d" });

  res.json({
    success: true,
    message: "Login successful",
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      location: user.location,
      bio: user.bio,
      avatar: user.avatar,
      coverPhoto: user.coverPhoto,
      isAdmin: user.isAdmin
    }
  });
});

// ✅ Update profile
router.put("/:id", async (req, res) => {
  try {
    const { name, email, phone, location, bio, avatar, coverPhoto } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, location, bio, avatar, coverPhoto },
      { new: true } // naya updated doc return hoga
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


module.exports = router;
