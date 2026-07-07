import dotenv from "dotenv";
dotenv.config();
import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { connectToDatabase } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import predictionRoutes from "./routes/predictionRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import fs from "fs";

const app = express();

const corsOptions = {
  origin: true, // Allow all origins for local ease-of-use
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("dev"));

// Static files for uploaded images
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the local upload folder exists
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use("/uploads", express.static(uploadsDir));

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api", authRoutes);
app.use("/api", predictionRoutes);
app.use("/api", statsRoutes);

const PORT = process.env.PORT || 5000;
async function start() {
  await connectToDatabase(process.env.MONGODB_URI);
  app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Local Server running on http://localhost:${PORT}`));
}

start().catch((e) => {
  console.error("❌ Failed to start server:", e);
  process.exit(1);
});
