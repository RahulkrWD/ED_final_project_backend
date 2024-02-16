const mongoose = require("mongoose");
const locationSchema = new mongoose.Schema({});

module.exports = mongoose.model("locations", locationSchema);
