const jwt = require("jsonwebtoken");
require("dotenv").config();

console.log(process.env.EXPIRES_IN);


const generateToken = (payload) => {
  const options = {
    expiresIn: process.env.EXPIRES_IN,
  };
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, options);
};

module.exports = { generateToken };
