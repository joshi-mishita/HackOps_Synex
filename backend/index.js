import express from "express";
import cors from "cors";
import { User } from "./models/user.js";
//import { run } from "./mongodb.js";
import { connectDB } from "./mongodb.js";
const app = express();
app.use(cors());
//app.use(express.json());

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
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1️⃣ Validation
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Name and password are required"
      });
    }

    // 2️⃣ Find user
    const user = await User.findOne({name: username });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // 3️⃣ Password check
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid password"
      });
    }

    // 4️⃣ Success response
    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});
app.post("/add-account", async (req, res) => {
  try {
    const { userId, bankName } = req.body;

    // Validation
    if (!userId || !bankName) {
      return res.status(400).json({
        success: false,
        message: "User ID and bank name are required"
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (bankName === "HDFC") {
      if (user.hdfcAccount) {
        return res.status(409).json({
          success: false,
          message: "HDFC account already exists"
        });
      }
      user.hdfcAccount = true;
    } 
    else if (bankName === "ICICI") {
      if (user.iciciAccount) {
        return res.status(409).json({
          success: false,
          message: "ICICI account already exists"
        });
      }
      user.iciciAccount = true;
    } 
    else {
      return res.status(400).json({
        success: false,
        message: "Invalid bank name"
      });
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: `${bankName} account added successfully`
    });

  } catch (error) {
    console.error("Add account error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add account"
    });
  }
});
app.post("/add-balance", async (req, res) => {
  try {
    const { userId, bankName, amount } = req.body;

    // Validation
    if (!userId || !bankName || amount == null) {
      return res.status(400).json({
        success: false,
        message: "User ID, bank name, and amount are required"
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0"
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Add balance
    if (bankName === "HDFC") {
      if (!user.hdfcAccount) {
        return res.status(400).json({
          success: false,
          message: "HDFC account does not exist"
        });
      }
      user.hdfcAmount += amount;
    } 
    else if (bankName === "ICICI") {
      if (!user.iciciAccount) {
        return res.status(400).json({
          success: false,
          message: "ICICI account does not exist"
        });
      }
      user.iciciAmount += amount;
    } 
    else {
      return res.status(400).json({
        success: false,
        message: "Invalid bank name"
      });
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Balance added successfully",
      balances: {
        hdfc: user.hdfcAmount,
        icici: user.iciciAmount
      }
    });

  } catch (error) {
    console.error("Add balance error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add balance"
    });
  }
});
app.post("/add-transaction", async (req, res) => {
  try {
    const { userId, bankName, category, amount, date, subscriptionName } = req.body;

    // Validation
    if (!userId || !bankName || !category || amount == null || !date) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided"
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Transaction amount must be greater than 0"
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Account & balance checks
    if (bankName === "HDFC") {
      if (!user.hdfcAccount) {
        return res.status(400).json({
          success: false,
          message: "HDFC account does not exist"
        });
      }
      if (user.hdfcAmount < amount) {
        return res.status(400).json({
          success: false,
          message: "Insufficient HDFC balance"
        });
      }
      user.hdfcAmount -= amount;
    } 
    else if (bankName === "ICICI") {
      if (!user.iciciAccount) {
        return res.status(400).json({
          success: false,
          message: "ICICI account does not exist"
        });
      }
      if (user.iciciAmount < amount) {
        return res.status(400).json({
          success: false,
          message: "Insufficient ICICI balance"
        });
      }
      user.iciciAmount -= amount;
    } 
    else {
      return res.status(400).json({
        success: false,
        message: "Invalid bank name"
      });
    }

    // Add transaction
    user.transactions.push({
      date,
      bankName,
      category,
      amount,
      subscriptionName: subscriptionName || null
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "Transaction added successfully",
      balances: {
        hdfc: user.hdfcAmount,
        icici: user.iciciAmount
      }
    });

  } catch (error) {
    console.error("Add transaction error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add transaction"
    });
  }
});
app.get("/balance/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      balances: {
        hdfc: {
          exists: user.hdfcAccount,
          amount: user.hdfcAmount
        },
        icici: {
          exists: user.iciciAccount,
          amount: user.iciciAmount
        }
      }
    });

  } catch (error) {
    console.error("Get balance error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch balance"
    });
  }
});
app.get("/transactions/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      transactions: user.transactions || []
    });

  } catch (error) {
    console.error("Get transactions error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});
app.get("/transactions/:userId/account/:bankName", async (req, res) => {
  try {
    const { userId, bankName } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const filteredTransactions = user.transactions.filter(
      (txn) => txn.bankName.toLowerCase() === bankName.toLowerCase()
    );

    res.status(200).json({
      success: true,
      count: filteredTransactions.length,
      transactions: filteredTransactions
    });

  } catch (error) {
    console.error("Filter transactions by account error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});
app.get("/transactions/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { category } = req.query;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    let transactions = user.transactions;

    if (category) {
      transactions = transactions.filter(
        (txn) => txn.category.toLowerCase() === category.toLowerCase()
      );
    }

    res.status(200).json({
      success: true,
      count: transactions.length,
      transactions
    });

  } catch (error) {
    console.error("Filter by category error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});
app.get("/transactions/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { category } = req.query;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    let transactions = user.transactions;

    if (category) {
      transactions = transactions.filter(
        txn => txn.category.toLowerCase().trim() === category.toLowerCase().trim()
      );
    }

    res.status(200).json({
      success: true,
      count: transactions.length,
      transactions
    });

  } catch (error) {
    console.error("Category filter error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});


app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});


