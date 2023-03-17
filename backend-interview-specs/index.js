const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const statsRouter = require("./routes/stats");
const productRouter = require("./routes/product");
const barRouter = require("./routes/bar");
const pieRouter = require("./routes/pie");
const allRouter = require("./routes/all");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("db connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(cors());
app.use(express.json());

app.use("/api/product", productRouter);
app.use("/api/stats", statsRouter);
app.use("/api/bar", barRouter);
app.use("/api/pie", pieRouter);
app.use("/api/all", allRouter);

app.listen(process.env.PORT || 8000, () => {
  console.log("Backend Server Running !");
});
