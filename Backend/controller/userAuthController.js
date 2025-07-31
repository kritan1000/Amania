const User = require("../model/userModel.js");
const bcrypt = require("bcrypt");
const {generateToken} = require("../security/jwt-utils.js");
const nodemailer = require("nodemailer");
const {crypto} = require("crypto");
const jwt = require("jsonwebtoken");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "rijankrishna14@gmail.com",
    pass: "tglhchrqalvdaqce",
  },
});

// Generate OTP
const generateOTP = () => crypto.randomInt(100000, 999999).toString();

// Generate reset token
const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

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

// Forgot Password - Send reset email
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate reset token
    const resetToken = generateResetToken();
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Save reset token to database
    await User.update(
      { 
        resetToken,
        resetTokenExpiry 
      },
      { where: { email } }
    );

    // Create reset URL
    const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`;

    // Send email
    const mailOptions = {
      from: "Amania Clothing Store",
      to: email,
      subject: "Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #8b4513;">Password Reset Request</h2>
          <p>Hello ${user.firstName},</p>
          <p>You requested a password reset for your Amania account.</p>
          <p>Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #8b4513; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 6px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this password reset, please ignore this email.</p>
          <p>Best regards,<br>Amania Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ 
      message: "Password reset email sent successfully. Please check your email." 
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Failed to send reset email" });
  }
};

// Validate reset token
const validateResetToken = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: "Reset token is required" });
    }

    const user = await User.findOne({ 
      where: { 
        resetToken: token,
        resetTokenExpiry: { [require('sequelize').Op.gt]: new Date() }
      }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    res.status(200).json({ message: "Token is valid" });
  } catch (error) {
    console.error("Validate reset token error:", error);
    res.status(500).json({ message: "Server error" });
  }
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

// Reset Password with token
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: "Token and password are required" });
    }

    // Find user with valid reset token
    const user = await User.findOne({ 
      where: { 
        resetToken: token,
        resetTokenExpiry: { [require('sequelize').Op.gt]: new Date() }
      }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Update password and clear reset token
    await User.update(
      { 
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      },
      { where: { id: user.id } }
    );

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  sendOtp,
  forgotPassword,
  validateResetToken,
  register,
  login,
  verifyOTP,
  resetPassword,
};