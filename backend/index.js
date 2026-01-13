import express from "express";
import cors from "cors";
import { User } from "./models/user.js";
//import { run } from "./mongodb.js";
import { connectDB } from "./mongodb.js";
const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;
//run();
await connectDB();
app.get("/", (req, res) => {
  res.send("Backend is running");
});
app.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Basic validation
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required"
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ name: username });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists"
      });
    }

    // Create new user with default values
    const newUser = new User({
      name: username,
      password: password,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      userId: newUser._id
    });
  } catch (error) {
    console.error("Signup error:", error);

    res.status(500).json({
      success: false,
      message: "Signup failed"
    });
  }
});
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});


