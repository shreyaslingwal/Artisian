const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  otp: {
    type: String,
    default: null
  },
  otpExpires: {
    type: Date,
    default: null
  },
  isPhoneVerified: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: ['buyer', 'seller', null],  // allow null
    default: null
  },
  profilePicture: {
    type: String,
    default: null
  },
  name: {
    type: String,
    trim: true,
    default: null
  },
  description: {
    type: String,
    trim: true,
    default: null
  },
  isProfileComplete: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Check if profile is complete
userSchema.methods.checkProfileCompletion = function() {
  if (this.role === 'seller') {
    this.isProfileComplete = !!(this.name && this.description && this.profilePicture);
  } else if (this.role === 'buyer') {
    this.isProfileComplete = true;
  }
  return this.isProfileComplete;
};

module.exports = mongoose.model('User', userSchema);

