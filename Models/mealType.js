const mongoose = require("mongoose");
const mealTypeSchema = new mongoose.Schema({});

module.exports = mongoose.model("mealtypes", mealTypeSchema);
