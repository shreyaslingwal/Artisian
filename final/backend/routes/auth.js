// Updated routes/auth.js with flexible phone validation
const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { generateOTP, sendOTP } = require('../utils/sms');
const auth = require('../middleware/auth');

const router = express.Router();

// Custom phone validation function
const validatePhone = (phone) => {
  // Allow various phone formats:
  // +1234567890, +919876543210, +11234567890, etc.
  const phoneRegex = /^\+\d{10,15}$/;
  return phoneRegex.test(phone);
};

// Step 1: Send OTP to phone number
router.post('/send-otp', [
  body('phone')
    .custom((value) => {
      if (!validatePhone(value)) {
        throw new Error('Please provide a valid phone number with country code (e.g., +1234567890)');
      }
      return true;
    })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { phone } = req.body;
    
    // Generate OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Check if user exists, if not create new user
    let user = await User.findOne({ phone });
    
    if (!user) {
      user = new User({
        phone,
        otp,
        otpExpires,
        registrationStep: 1
      });
    } else {
      user.otp = otp;
      user.otpExpires = otpExpires;
    }

    await user.save();

    // Send OTP via SMS
    const smsSent = await sendOTP(phone, otp);
    
    if (!smsSent) {
      return res.status(500).json({ message: 'Failed to send OTP' });
    }

    res.json({ 
      message: 'OTP sent successfully',
      userId: user._id 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Step 2: Verify OTP
router.post('/verify-otp', [
  body('phone')
    .custom((value) => {
      if (!validatePhone(value)) {
        throw new Error('Please provide a valid phone number with country code (e.g., +1234567890)');
      }
      return true;
    }),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { phone, otp } = req.body;

    const user = await User.findOne({ phone });
    
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    if (user.otp !== otp || user.otpExpires < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Mark phone as verified
    user.isPhoneVerified = true;
    user.otp = null;
    user.otpExpires = null;
    user.registrationStep = 2;
    
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    const isNewUser = user.role === null;

    res.json({
      message: 'Phone verified successfully',
      token,
      isNewUser,
      user: {
        id: user._id,
        phone: user.phone,
        isPhoneVerified: user.isPhoneVerified,
        registrationStep: user.registrationStep,
        role: user.role,
        name: user.name,
        isProfileComplete: user.isProfileComplete
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;