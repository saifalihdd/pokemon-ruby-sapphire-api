import "dotenv/config";
import express from "express";
import connectDB from "./config/db.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Pokemon Ruby & Sapphire API berjalan");
});

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
  });
};

startServer();