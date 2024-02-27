const userModel = require("../Models/newUser");
const bcrypt = require("bcrypt");

async function register(req, res) {
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
}
module.exports = register;
