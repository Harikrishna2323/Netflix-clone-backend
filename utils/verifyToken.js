const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function verify(req, res, next) {
  const authHeader = req.headers.token;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    req.user = await User.findById(decoded.id);

    next();
  } else {
    return res.status(401).json("You are not authenticated.");
  }
}
module.exports = verify;
