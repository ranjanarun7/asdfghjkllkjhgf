const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const cors = require("cors");

const authRoutes = require('./routes/authRoutes.js');
const placeRoutes = require('./routes/placeRoutes.js');
const searchRoutes=require('./routes/searchRoutes.js');
const productRoutes = require('./routes/productRoutes.js');
const cartRoutes = require('./routes/cartRoutes.js');
const cultureRoutes=require('./routes/cultureRoutes.js');
const orderRoutes=require('./routes/orderRoutes.js');
const itineraryRoutes=require('./routes/itinerary.js');
const chatRoutes=require('./routes/chat.js');
const analyzeRoutes = require('./routes/analyze.js');
const feedbackRoutes = require("./routes/feedbackRoutes");
const guideRoutes = require("./routes/guideRoutes");
const userRoutes = require("./routes/userRoutes");
const paymentRoutes=require("./routes/paymentRoutes.js");

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

mongoose
  .connect(mongoURL)
  .then(async () => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.log(err));

// Routes
app.use("/uploads", express.static("uploads"));
app.use('/auth', authRoutes);
app.use("/users", userRoutes);
app.use('/places', placeRoutes);
app.use('/search',searchRoutes);
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);
app.use('/cultures',cultureRoutes);
app.use('/order',orderRoutes);
app.use("/itinerary", itineraryRoutes);
app.use("/chat", chatRoutes);
app.use('/analyze', analyzeRoutes);
app.use('/feedback', feedbackRoutes);
app.use("/guides", guideRoutes);
app.use('/api/payment',paymentRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
