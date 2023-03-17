const Product = require("../models/Product");
const router = require("express").Router();

router.post("/", async (req, res) => {
  try {
    const savedProduct = await Product.create(req.body);
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
