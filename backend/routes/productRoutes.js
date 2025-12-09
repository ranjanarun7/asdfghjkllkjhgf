const express = require('express');
const router = express.Router();
const Product = require('../models/productModel.js');

router.get("/", async (req, res) => {
  const category = req.query.category;

  let filter = {};

  if (category && category !== "all") {
    filter.category = category.toLowerCase().trim();
  }

  const products = await Product.find(filter);
  res.json(products);
});

router.post("/", async (req, res) => {
  const newProduct = new Product(req.body);
  await newProduct.save();
  res.json({ message: "Product added", newProduct });
});

module.exports = router;