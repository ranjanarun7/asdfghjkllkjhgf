const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const cors = require("cors");

const authRoutes = require('./routes/authRoutes.js');
const placeRoutes = require('./routes/placeRoutes.js');
//const Place = require('./models/placeModel.js');
const searchRoutes = require('./routes/searchRoutes.js')
const productRoutes = require('./routes/productRoutes.js');
const cartRoutes = require('./routes/cartRoutes.js');
const cultureRoutes = require('./routes/cultureRoutes.js');
const orderRoutes = require('./routes/orderRoutes.js');
const itineraryRoutes = require('./routes/itinerary.js');
const chatRoutes = require('./routes/chat.js')
const analyzeRoutes = require('./routes/analyze.js')
const feedbackRoutes = require("./routes/feedbackRoutes");
const guideRoutes = require("./routes/guideRoutes");
const userRoutes = require("./routes/userRoutes");
const paymentRoutes = require("./routes/paymentRoutes.js")
const { checkConnection } = require('./services/ledgerService');

// Server & DB config
const port = process.env.PORT || 5000;
const mongoURL = process.env.MONGO_URL;

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://jharkhand-ashen.vercel.app"
  ],
  credentials: true
}));




app.use(express.json());

// Passport Config
require('./config/passport');
const session = require('express-session');
const passport = require('passport');

app.use(session({
  secret: 'secret_key_session', // Change this to a secure random string in production
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Default Route
app.get('/', (req, res) => {
  res.send('Welcome to the Jharkhand Tourism Backend!');
});

// Connect to MongoDB and Seed Data
// Connect to MongoDB and Seed Data
mongoose
  .connect(mongoURL, {
    serverSelectionTimeoutMS: 5000
  })
  .then(async () => {
    console.log("Connected to MongoDB");

    //await seedInitialPlaces(); // seed run here
  })
  .catch((err) => console.log(err));

mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Simple DB Test Route
app.get('/test-db', async (req, res) => {
  try {
    const User = require('./models/userModel');
    const count = await User.countDocuments();
    res.json({ success: true, message: "DB Connection OK", userCount: count });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Routes
app.use("/uploads", express.static("uploads"));
app.use('/auth', authRoutes);
app.use("/users", userRoutes);
app.use('/places', placeRoutes);
app.use('/search', searchRoutes);
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);
app.use('/cultures', cultureRoutes);
app.use('/order', orderRoutes);
app.use("/itinerary", itineraryRoutes);
app.use("/chat", chatRoutes);
app.use('/analyze', analyzeRoutes);
app.use('/feedback', feedbackRoutes);
app.use("/guides", guideRoutes);
app.use('/api/payment', paymentRoutes)
// Start Server
app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
  // await checkConnection();
});
