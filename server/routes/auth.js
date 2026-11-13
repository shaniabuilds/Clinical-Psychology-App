const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const Admin = require("../models/Admin");

const router = express.Router();

// Max 10 login attempts per 15 minutes from one IP (stops password guessing).
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many attempts. Try again in 15 minutes." },
});

// Compared when the username does not exist, so the reply time is the same.
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 12);

// POST /api/auth/login
router.post("/login", limiter, async (req, res, next) => {
  try {
    const { username, password } = req.body || {};
    if (typeof username !== "string" || typeof password !== "string" || !username.trim() || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }
    const admin = await Admin.findOne({ username: username.trim().toLowerCase() });
    const ok = await bcrypt.compare(password, admin ? admin.passwordHash : DUMMY_HASH);
    if (!admin || !ok) {
      return res.status(401).json({ error: "Wrong username or password" });
    }
    const token = jwt.sign(
      { sub: String(admin._id), u: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES || "8h" }
    );
    res.json({ token });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
