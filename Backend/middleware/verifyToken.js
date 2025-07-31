/**
 * JWT Token Verification Middleware
 * Validates JWT tokens for protected routes
 * Extracts user information from token payload
 */

const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.id = decoded.id;
    next();
  });
};

module.exports = verifyToken;