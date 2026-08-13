/**
 * One-time script to create an admin account.
 * Usage: node scripts/createAdmin.js admin@hirehub.com yourPassword123 "Admin Name"
 */
require("dotenv").config();
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const User = require("../models/User");

async function run() {
  const [, , email, password, name = "Admin"] = process.argv;
  if (!email || !password) {
    console.log("Usage: node scripts/createAdmin.js <email> <password> [name]");
    process.exit(1);
  }
  await connectDB();
  const existing = await User.findOne({ email });
  if (existing) {
    existing.role = "admin";
    await existing.save();
    console.log(`Existing user ${email} promoted to admin.`);
  } else {
    const hashed = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashed, role: "admin" });
    console.log(`Admin user created: ${email}`);
  }
  process.exit(0);
}

run();
