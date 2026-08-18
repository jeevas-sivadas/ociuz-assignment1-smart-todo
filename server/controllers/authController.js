const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");


// =========================
// Generate JWT
// =========================

const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d"
    }
  );
};


// =========================
// Register
// =========================

const register = async (req, res) => {
  try {

    const {
      name,
      email,
      password
    } = req.body;


    // Validate fields

    if (
      !name ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        message:
          "Name, email and password are required"
      });
    }


    // Check existing user

    const existingUser =
      await User.findOne({
        email
      });


    if (existingUser) {
      return res.status(409).json({
        message:
          "User already exists"
      });
    }


    // Hash password

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );


    // Create user

    const user =
      await User.create({
        name,
        email,
        password: hashedPassword
      });


    // Generate token

    const token =
      generateToken(user._id);


    return res.status(201).json({

      message:
        "Registration successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }

    });

  } catch (error) {

    console.error(
      "REGISTER ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Server error"
    });
  }
};


// =========================
// Login
// =========================

const login = async (req, res) => {
  try {

    const {
      email,
      password
    } = req.body;


    // Validate fields

    if (
      !email ||
      !password
    ) {
      return res.status(400).json({
        message:
          "Email and password are required"
      });
    }


    // Find user

    const user =
      await User.findOne({
        email
      });


    if (!user) {
      return res.status(401).json({
        message:
          "Invalid email or password"
      });
    }


    // Compare password

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );


    if (!isMatch) {
      return res.status(401).json({
        message:
          "Invalid email or password"
      });
    }


    // Generate token

    const token =
      generateToken(user._id);


    return res.json({

      message:
        "Login successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }

    });

  } catch (error) {

    console.error(
      "LOGIN ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Server error"
    });
  }
};


// =========================
// Get Protected User
// =========================

const getProtectedUser = async (
  req,
  res
) => {

  try {

    return res.status(200).json({

      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email
      }

    });

  } catch (error) {

    console.error(
      "GET PROTECTED USER ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Server error"
    });
  }
};


// =========================
// Export
// =========================

module.exports = {
  register,
  login,
  getProtectedUser
};