const jwt = require("jsonwebtoken");
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.send({ message: "Unauthorized person" });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.send({ message: "Invalid token" });
    }
    req.user = user;
    next();
  });
};
module.exports = authenticateToken;
