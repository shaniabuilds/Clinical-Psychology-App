// Run once:  node createAdmin.js <username> <password>
// Running it again with the same username resets that admin's password.
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./models/Admin");

(async () => {
  const [u, p] = process.argv.slice(2);
  if (!u || !p || p.length < 8) {
    console.log("Usage: node createAdmin.js <username> <password with 8 or more characters>");
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGODB_URI);
  const passwordHash = await bcrypt.hash(p, 12);
  await Admin.findOneAndUpdate(
    { username: u.trim().toLowerCase() },
    { passwordHash },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  console.log("Admin ready:", u.trim().toLowerCase());
  await mongoose.disconnect();
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
