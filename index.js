import "dotenv/config";
import express from "express";
import connectDB from "./config/db.js";
import pokemonRoutes from "./routes/pokemonRoutes.js";
import trainerRoutes from "./routes/trainerRoutes.js";
import speciesRoutes from "./routes/speciesRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Pokemon Ruby & Sapphire API berjalan");
});

app.use("/pokemon", pokemonRoutes);
app.use("/trainers", trainerRoutes);
app.use("/species", speciesRoutes);

// Route yang tidak dikenal
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Endpoint tidak ditemukan" });
});

// JSON body yang rusak (mis. koma berlebih) dibalas 400, bukan halaman error HTML
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ success: false, message: "Format JSON pada body tidak valid" });
  }
  console.error(err);
  res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
});

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
  });
};

startServer();
