const express = require("express");
const router = express.Router();
const userModel = require("../Models/newUser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticateToken = require("../middleware/authMiddleware");

// Signup page
router.post("/register", async function (req, res) {
  try {
    const { name, email, phone, password, uniqueId } = req.body;
    if (!name) {
      return res.send({ message: "Name is required" });
    }
    if (!email) {
      return res.send({ message: "Email is required" });
    }
    if (!phone) {
      return res.send({ message: "Phone is required" });
    }
    if (!password) {
      return res.send({ message: "Password is required" });
    }

    const exisitingUser = await userModel.findOne({ email });
    if (exisitingUser) {
      return res.send({
        success: false,
        message: "This Email is already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    await userModel.create({
      name,
      email,
      phone,
      password: hashedPassword,
      uniqueId,
    });
    res.send({ success: true, message: "User created successfully" });
  } catch (error) {
    res.send({ success: false, message: "Internal server error", error });
  }
});

// Login page
router.post("/login", async function (req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.send({ message: "Invalid email or password" });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      res.send({ success: false, message: "Invalid email or password" });
    } else {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        // Generate JWT Token for authentication
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
          expiresIn: "24h",
        });
        res.send({ success: true, message: "Login successful", token, user });
      } else {
        res.send({ success: false, message: "Invalid email or password" });
      }
    }
  } catch (error) {
    res.send({ success: false, message: "error in login" });
  }
});
// Google auth signup
router.post("/signup/googleAuth", async function (req, res) {
  try {
    const { name, email, uniqueId } = req.body;

    const exisitingUser = await userModel.findOne({ email });
    if (exisitingUser) {
      return res.send({ success: false, message: "User already exists" });
    }

    // Create a new user for Google authentication
    const signup = await userModel.create({ name, email, uniqueId });

    res.send({
      success: true,
      message: "Google authentication created",
      user: signup,
    });
  } catch (err) {
    res.send({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
});

// Google auth login
router.post("/googleAuth/login", async function (req, res) {
  const { email } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) {
    res.send({ success: false, message: "User not found" });
  } else {
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    res.send({ success: true, message: "Login successful", token, user });
  }
});

// find profile using query || method GET
router.get("/profile/:id", async function (req, res) {
  let query = {};
  let id = +req.params.id;
  if (id) {
    query = { uniqueId: id };
  }
  const profile = await userModel.findOne(query);
  res.send(profile);
});

// update profile || PUT
router.put("/profile/update/:id", async function (req, res) {
  let query = {};
  let id = +req.params.id;
  if (id) {
    query = { uniqueId: id };
  }
  try {
    const updateProfile = await userModel.updateOne(query, {
      $set: {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
      },
    });
    res.send({ success: true, message: "Update successfull", updateProfile });
  } catch (err) {
    res.send({ success: false, message: "user Update failed", err });
  }
});

module.exports = router;
