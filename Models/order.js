const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderId: Number,
    name: String,
    email: String,
    address: String,
    phone: Number,
    cost: Number,
    restName: String,
    orderItems: String,
    uniqueId: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("orders", orderSchema);
