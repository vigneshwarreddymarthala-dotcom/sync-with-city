require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8002;

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded files under /uploads
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Health check / root
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "Sync With City API",
    cloud: "Google Cloud",
    project: process.env.GCP_PROJECT_ID || "spirits-campus-events",
    database: "Firestore (europe-west3)",
  });
});

// Mount Routes
app.use(require("./routes/user"));
app.use(require("./routes/creator"));
app.use(require("./routes/services"));

// 404 catch-all
app.use((req, res) => {
  console.log(`[404 Not Found] ${req.method} ${req.url}`);
  res.status(404).json({ error: `Route not found: ${req.method} ${req.url}` });
});

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 Backend Server running on http://localhost:${PORT}`);
  console.log(`📦 Project: ${process.env.GCP_PROJECT_ID || "spirits-campus-events"}`);
  console.log(`🔥 Database: Google Cloud Firestore`);
  console.log(`===============================================`);
});
