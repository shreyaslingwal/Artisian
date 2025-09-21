// utils/sms.js
const generateOTP = () => {
  // Always return mock OTP for development
  return "123456";
};

const sendOTP = async (phone, otp) => {
  try {
    // Mock SMS sending - just log the OTP
    console.log(`Mock OTP sent to ${phone}: ${otp}`);
    console.log(`Use OTP: 123456 for verification`);
    return true;
  } catch (error) {
    console.error('Mock SMS error:', error);
    return false;
  }
};

module.exports = { generateOTP, sendOTP };
