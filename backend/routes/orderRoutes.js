const express = require("express");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();

const Cart = require("../models/cartModel");
const Order = require("../models/order");
const { recordTransaction } = require("../services/ledgerService");

// ✅ CREATE ORDER + PAYMENT ID
router.post("/create-order", async (req, res) => {
  const orderId = "ORD-" + uuidv4().slice(0, 8);
  const paymentId = "PAY-" + uuidv4().slice(0, 8);

  res.json({ orderId, paymentId });
});

// ✅ CONFIRM PAYMENT (from blockchain later)
router.post("/confirm-payment", async (req, res) => {
  const { userId, orderId, paymentId, address } = req.body;

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: "Cart empty" });
    }

    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // ✅ Save Order to DB
    const newOrder = new Order({
      userId,
      orderId,
      paymentId,
      items: cart.items,
      address,
      totalAmount,
    });

    await newOrder.save();

    // 2. Save to Ledger (Fire and Forget)
    recordTransaction({
      type: 'PAYMENT',
      orderId: newOrder.orderId,
      paymentId: newOrder.paymentId,
      amount: newOrder.totalAmount,
      userId: newOrder.userId,
      currency: "INR" // Defaulting to INR as per recent preferences
    });

    // ✅ Clear cart after order success
    cart.items = [];
    await cart.save();

    res.json({ success: true, message: "Order placed successfully" });
  } catch (err) {
    console.error("Order save failed:", err);
    res.status(500).json({ error: "Order not saved" });
  }
});

// ✅ GET ORDER HISTORY BY USER
router.get("/history/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("Order fetch failed:", err);
    res.status(500).json({ error: "Could not fetch orders" });
  }
});

module.exports = router;
