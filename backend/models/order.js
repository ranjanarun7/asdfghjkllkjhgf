const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },

  orderId: String,
  paymentId: String,

  items: [
    {
      productId: String,
      name: String,
      price: Number,
      image: String,
      quantity: Number
    }
  ],

  address: {
    name: String,
    phone: String,
    street: String,
    city: String,
    pincode: String
  },

  totalAmount: Number,

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Order", orderSchema);
