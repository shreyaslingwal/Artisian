const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String, // filename for local storage
      required: true
    },
    isPrimary: {
      type: Boolean,
      default: false
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  videos: [{
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String, // filename for local storage
      required: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  description: {
    type: String,
    trim: true,
    maxLength: 2000
  },
  uploadStep: {
    type: Number,
    default: 1 // 1: images/videos, 2: description, 3: complete
  },
  isComplete: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Method to check if product listing is complete
productSchema.methods.checkListingCompletion = function() {
  const hasMedia = (this.images && this.images.length > 0) || (this.videos && this.videos.length > 0);
  const hasDescription = this.description && this.description.trim().length > 0;
  
  if (hasMedia && hasDescription) {
    this.isComplete = true;
    this.uploadStep = 3;
  }
  return this.isComplete;
};

// Method to add image
productSchema.methods.addImage = function(imageData) {
  // Set first image as primary if no primary exists
  if (this.images.length === 0) {
    imageData.isPrimary = true;
  }
  this.images.push(imageData);
  return this.save();
};

// Method to add video
productSchema.methods.addVideo = function(videoData) {
  this.videos.push(videoData);
  return this.save();
};

// Method to remove image
productSchema.methods.removeImage = function(imageId) {
  this.images.pull(imageId);
  // If removed image was primary and there are other images, set first one as primary
  if (this.images.length > 0 && !this.images.some(img => img.isPrimary)) {
    this.images[0].isPrimary = true;
  }
  return this.save();
};

// Method to remove video
productSchema.methods.removeVideo = function(videoId) {
  this.videos.pull(videoId);
  return this.save();
};

// Pre-save middleware to ensure data consistency
productSchema.pre('save', function(next) {
  // Ensure at least one primary image exists if there are images
  if (this.images.length > 0 && !this.images.some(img => img.isPrimary)) {
    this.images[0].isPrimary = true;
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
