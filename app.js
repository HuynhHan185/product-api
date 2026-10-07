const express = require("express");
const mongoose = require("mongoose");
const productRoutes = require("./routes/product.routes");

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  const dbConnected = mongoose.connection.readyState === 1;
  const status = dbConnected ? 200 : 503;
  res.status(status).json({
    status: dbConnected ? "ok" : "unhealthy",
    database: dbConnected ? "connected" : "disconnected",
  });
});

app.use("/api/products", productRoutes);

module.exports = app;
