const User = require("../model/userModel.js");
const bcrypt = require("bcrypt");
const {generateToken} = require("../security/jwt-utils.js");
const nodemailer = require("nodemailer");
const {crypto} = require("crypto");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "rijankrishna14@gmail.com",
    pass: "tglhchrqalvdaqce",
  },
});

// Generate OTP
const generateOTP = () => crypto.randomInt(100000, 999999).toString();

const sendOtp = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user || user == null) {
    res.status(400).json({ message: "User not found" });
  }
  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
  transporter.sendMail({
    from: "Finder Keeper",
    to: email,
    subject: "OTP Verification",
    text: `Your OTP is: ${otp}`,
  });
  await User.update({ otp }, { where: { email } });
  res.status(200).json({ message: "Otp has been sent to your email" });
};

const saltRounds = 10;

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body.data;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !phone
    ) {
      return res
        .status(400)
        .json({ message: "Please provide all the required fields" });
    }

    // Check if user already exists
    let user = await User.findOne({ where: { email } });
    if (user != null) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Convert phone to number and validate
    const phoneNumber = parseInt(phone.replace(/\D/g, ''));
    if (isNaN(phoneNumber) || phoneNumber.toString().length < 10) {
      return res.status(400).json({ message: "Please provide a valid phone number" });
    }

    // Hash password
    bcrypt.hash(password, saltRounds, async (err, hash) => {
      if (err) {
        console.log("Error hashing password", err);
        return res.status(500).json({ message: "Error creating account" });
      } else {
        try {
          await User.create({
            firstName,
            lastName,
            email,
            password: hash,
            contact: phoneNumber,
          });
          return res.status(201).json({ message: "User registered successfully" });
        } catch (error) {
          console.error("Database error:", error);
          return res.status(500).json({ message: "Error creating account" });
        }
      }
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  console.log(req.body);

  try {
    if (req.body.email == null) {
      return res.status(500).json({ message: "email is required" });
    } else if (req.body.password == null) {
      return res.status(500).json({ message: "password is required" });
    }
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) {
      return res.status(500).json({ message: "User not found" });
    }
    bcrypt.compare(req.body.password, user.password, (err, result) => {
      if (err) {
        console.error("Error comparing passwords:", err);
      } else {
        if (result) {
          const token = generateToken({ id: user.id });
          return res.status(200).json({
            firstName: user.firstName,
            lastName: user.lastName,
            fullname: `${user.firstName} ${user.lastName}`,
            user_id: user.id,
            email: user.email,
            token,
          });
        } else {
          res.status(400).json({ message: "Incorrect password" });
        }
      }
    });
  } catch (error) {
    res.status(500).json({ error: "failed to login" });
  }
};
const verifyOTP = async (req, res) => {
  const { otp, email } = req.body;
  const user = await User.findOne({ where: { email } });
  console.log(user);

  if (!otp || otp == null) {
    res.status(200).json({ message: "Please provide valid otp" });
  } else if (otp == user.otp) {
    res.status(200).json({ message: "Otp has been verified" });
  } else {
    res.status(400).json({ message: "Invalid Otp " });
  }
};
const resetPassword = async (req, res) => {
  const { email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    const [updated] = await User.update(
      { password: hash },
      { where: { email } }
    );

    if (updated) {
      res.status(200).json({ message: "Password updated successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  sendOtp,
  register,
  login,
  verifyOTP,
  resetPassword,
};