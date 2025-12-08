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


// FORGOT PASSWORD
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Generate a temporary token valid for 15 mins
    const secret = "SECRET123" + user.password; // utilizing password hash makes it one-time use if password changes
    const token = jwt.sign({ email: user.email, id: user._id }, secret, { expiresIn: "15m" });

    // Link logic
    const link = `http://localhost:3000/reset-password?id=${user._id}&token=${token}`;

    console.log("------------------------------------------");
    console.log(`Password reset link for ${email}:`);
    console.log(link);
    console.log("------------------------------------------");

    res.json({ success: true, message: "Reset link logged to backend console!" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Something went wrong" });
  }
});

// RESET PASSWORD
router.post("/reset-password", async (req, res) => {
  const { id, token, password } = req.body;

  try {
    const user = await User.findOne({ _id: id });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const secret = "SECRET123" + user.password;
    try {
      jwt.verify(token, secret);
    } catch (err) {
      return res.json({ success: false, message: "Invalid or expired token" });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    await User.updateOne(
      { _id: id },
      { $set: { password: encryptedPassword } }
    );

    res.json({ success: true, message: "Password updated successfully" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Something went wrong" });
  }
});


module.exports = router;
