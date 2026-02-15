const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "my_super_secret_fallback_key";

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  const db = req.db;

  try {
    const userExists = await db.get(`SELECT * FROM user WHERE email = ?`, [
      email,
    ]);
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.run(
      `INSERT INTO user (name, email, password) VALUES (?, ?, ?)`,
      [name, email, hashedPassword],
    );

    res.status(201).json({ message: "User created", userId: result.lastID });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Server error during signup" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const db = req.db;

  try {
    const user = await db.get(`SELECT * FROM user WHERE email = ?`, [email]);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Wrong password" });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
