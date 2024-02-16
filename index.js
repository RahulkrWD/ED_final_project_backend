const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const restaurant = require("./Routes/restaurant");
const createUser = require("./Routes/createUser");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
dotenv.config();
connectDB();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Home page route
app.get("/", function (req, res) {
  res.send("Welcome to my Zomato App");
});

// Restaurant route
app.use("/restaurant", restaurant);

// User creation route
app.use("/createUser", createUser);

const PORT = process.env.PORT || 4200;
app.listen(PORT, () => {
  console.log(`sever running on PORT ${PORT} and ${process.env.DEV_MODE}`);
});
