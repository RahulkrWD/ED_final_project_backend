const userModel = require("../Models/newUser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function loginController(req, res) {
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
}
module.exports = loginController;
