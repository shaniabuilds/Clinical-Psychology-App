const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const apiRoutes = require("./routes/api");
const authRoutes = require("./routes/auth");
const auth = require("./middleware/auth");

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error("Set JWT_SECRET (32 or more characters) in server/.env");
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/susalab";

// If you deploy behind a proxy (Render, Railway, Nginx) uncomment the next line
// so the login rate limit sees the real visitor IP:
// app.set("trust proxy", 1);

app.use(cors());
app.use(express.json({ limit: "1mb" }));

// Serve frontend static assets (index.html, app.js, run.js, record.js ...)
app.use(express.static(path.join(__dirname, "../client")));

// Public: login only. Everything else under /api needs a valid admin token.
app.use("/api/auth", authRoutes);
app.use("/api", auth, apiRoutes);

// Central error handler
app.use((err, req, res, next) => {
  if (err.name === "CastError") {
    return res.status(400).json({ error: `Invalid ${err.path}` });
  }
  if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Internal server error" });
});

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB successfully");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });
