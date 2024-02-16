const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({});

module.exports = mongoose.model("menus", menuSchema);
