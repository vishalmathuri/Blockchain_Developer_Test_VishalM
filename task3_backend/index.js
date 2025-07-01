require("dotenv").config();
const express = require("express");
const { ethers } = require("ethers");
const taskRoutes = require("./routes/tasks");

const app = express();
app.use(express.json());
app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
