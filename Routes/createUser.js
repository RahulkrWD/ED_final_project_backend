const express = require("express");
const router = express.Router();
const registerController = require("../controller/registerController");
const loginController = require("../controller/loginController");
const googleAuthController = require("../controller/googleAuthController");
const profileController = require("../controller/profileController");

// register
router.post("/register", registerController);

// Login page
router.post("/login", loginController);

// Google auth signup
router.post("/signup/googleAuth", googleAuthController.googleAuthSignup);

// Google auth login
router.post("/googleAuth/login", googleAuthController.googleAuthLogin);

// find profile using query || method GET
router.get("/profile/:id", profileController.profile);

// update profile || PUT
router.put("/profile/update/:id", profileController.updateProfile);

module.exports = router;
