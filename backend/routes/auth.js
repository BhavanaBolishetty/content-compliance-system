const express = require("express");
const router = express.Router();

const Company = require("../models/Company");
const User = require("../models/User");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER COMPANY + ADMIN
router.post("/register-company", async (req, res) => {
  try {
    const { companyName, name, email, password } = req.body;

    const company = await Company.create({
      name: companyName
    });

    const hashed = await bcrypt.hash(password, 10);

    const admin = await User.create({
      name,
      email,
      password: hashed,
      role: "admin",
      companyId: company._id
    });

    const token = jwt.sign(
      {
        userId: admin._id,
        email: admin.email,
        companyId: company._id,
        companyName: company.name,  
        role: "admin",
        email: admin.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});


// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // 🔥 FETCH COMPANY HERE
    const company = await Company.findById(user.companyId);
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        companyId: user.companyId,
        companyName: company.name,  
        role: user.role,
        email: user.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, role: user.role });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
