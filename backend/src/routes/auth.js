import express from "express";
const router = express.Router();

// Demo users in memory
const users = [];

// Signup
router.post("/signup", (req, res) => {
  const { name, password } = req.body;

  if (!name || !password)
    return res.status(400).json({ message: "Name & password required" });

  const exists = users.find((u) => u.name.toLowerCase() === name.toLowerCase());
  if (exists) return res.status(409).json({ message: "User already exists" });

  users.push({ name, password });
  return res.json({ message: "Signup success ✅", user: { name } });
});

// Login
router.post("/login", (req, res) => {
  const { name, password } = req.body;

  const found = users.find(
    (u) => u.name.toLowerCase() === name.toLowerCase() && u.password === password
  );

  if (!found) return res.status(401).json({ message: "Invalid credentials" });

  return res.json({ message: "Login success ✅", user: { name: found.name } });
});

export default router;
