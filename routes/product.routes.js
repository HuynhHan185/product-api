const express = require("express");
const Product = require("../models/Product");
const router = express.Router();

const handleError = (err, res) => {
  if (err.code === 11000) return res.status(409).json({ message: "pid đã tồn tại" });
  if (err.name === "ValidationError") return res.status(400).json({ message: err.message });
  return res.status(500).json({ message: err.message });
};

router.post("/", async (req, res) => {
  try {
    res.status(201).json(await Product.create(req.body));
  } catch (err) { handleError(err, res); }
});

router.get("/", async (req, res) => {
  try {
    res.json(await Product.find());
  } catch (err) { handleError(err, res); }
});

router.get("/:pid", async (req, res) => {
  try {
    const product = await Product.findOne({ pid: req.params.pid });
    if (!product) return res.status(404).json({ message: "Không tìm thấy" });
    res.json(product);
  } catch (err) { handleError(err, res); }
});

router.put("/:pid", async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { pid: req.params.pid },
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ message: "Không tìm thấy" });
    res.json(product);
  } catch (err) { handleError(err, res); }
});

router.delete("/:pid", async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ pid: req.params.pid });
    if (!product) return res.status(404).json({ message: "Không tìm thấy" });
    res.json({ message: "Đã xóa" });
  } catch (err) { handleError(err, res); }
});

module.exports = router;
