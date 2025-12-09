const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },

  email: { type: String, required: true, unique: true },

  password: { type: String, required: true },

  phone: { type: String },

  location: { type: String },

  bio: { type: String },

  avatar: {
    type: String,
    default: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"
  },
  coverPhoto: {
    type: String,
    default:
      "https://images.unsplash.com/photo-1626246473523-289552cb874a?q=80&w=1600&auto=format&fit=crop"
  },

  isAdmin: { type: Boolean, default: false },
  googleId: { type: String },
  facebookId: { type: String },
  twitterId: { type: String }
});

module.exports = mongoose.model("User", userSchema);
