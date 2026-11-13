const jwt = require("jsonwebtoken");

// Every /api route except /api/auth/login goes through this check.
module.exports = function auth(req, res, next) {
  const h = req.headers.authorization || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : "";
  if (!token) return res.status(401).json({ error: "Login required" });
  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (e) {
    res.status(401).json({ error: "Session expired. Please sign in again." });
  }
};
