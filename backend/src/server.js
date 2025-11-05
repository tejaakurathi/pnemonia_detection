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

const app = express();
const allowedOrigins = [
  "https://dj62t8i8j93hf.cloudfront.net", // ✅ your frontend CloudFront
  "http://localhost:3000",
  "http://localhost:5173",
  "http://13.233.85.152:5173",
  "http://13.233.85.152",
];

const corsOptions = {
  origin: function (origin, callback) {
    // ✅ Allow requests without Origin (e.g., CloudFront, Postman, or direct server calls)
    if (!origin) return callback(null, true);

    // ✅ Allow all matching CloudFront subdomains (just in case)
    if (allowedOrigins.includes(origin) || origin.endsWith(".cloudfront.net")) {
      return callback(null, true);
    }

    console.log("❌ Blocked by CORS:", origin);
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Amz-Date",
    "X-Api-Key",
    "X-Amz-Security-Token",
  ],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("dev"));

// static files for uploaded images
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(process.cwd(), "src", "uploads")));
app.use("/public", express.static(path.join(__dirname, "uploads")));

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api", authRoutes);
app.use("/api", predictionRoutes);
app.use("/api", statsRoutes);

const PORT = process.env.PORT || 5000;
async function start() {
  await connectToDatabase(process.env.MONGODB_URI);
  app.listen(PORT, "0.0.0.0", () => console.log(`Server running on :${PORT}`));
}

start().catch((e) => {
  console.error("Failed to start server", e);
  process.exit(1);
});
