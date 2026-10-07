require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Đã kết nối MongoDB (container nammongodb)");
    app.listen(PORT, () => console.log(`API chạy tại http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("Lỗi kết nối MongoDB:", err.message);
    process.exit(1);
  });
