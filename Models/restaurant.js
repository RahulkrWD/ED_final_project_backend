const mongoose = require("mongoose");
const restaurantSchema = new mongoose.Schema({});

module.exports = mongoose.model("restaurants", restaurantSchema);
