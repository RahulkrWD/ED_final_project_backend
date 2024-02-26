const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    phone: Number,
    uniqueId: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", userSchema);
