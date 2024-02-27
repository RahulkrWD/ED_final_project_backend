const userModel = require("../Models/newUser");
const jwt = require("jsonwebtoken");

// googleAuthSignup
async function googleAuthSignup(req, res) {
  try {
    const { name, email, uniqueId } = req.body;

    const exisitingUser = await userModel.findOne({ email });
    if (exisitingUser) {
      return res.send({ success: false, message: "User already exists" });
    }

    // Create a new user
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
}

// googleAuthLogin
async function googleAuthLogin(req, res) {
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
}
module.exports = { googleAuthLogin, googleAuthSignup };
