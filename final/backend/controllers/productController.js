// ============================================
// 4. controllers/productController.js
// ============================================
const Product = require('../models/Product');
const path = require('path');
const fs = require('fs');
const { enhanceWithGemini } = require('../utils/gemini');

// Create new product
exports.createProduct = async (req, res) => {
  try {
    const { name, description } = req.body;

    const product = new Product({
      name,
      description: description || '',
      seller: req.user?.id // Add seller if authenticated
    });

    // Check if product listing is complete (will be true if description is provided)
    product.checkListingCompletion();
    await product.save();
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Upload media (images/videos)
exports.uploadMedia = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'No files uploaded' 
      });
    }

    // Process uploaded files
    const uploadedFiles = req.files.map(file => ({
      url: `/uploads/product/${file.filename}`,
      publicId: file.filename,
      type: file.mimetype.startsWith('video/') ? 'video' : 'image'
    }));

    uploadedFiles.forEach(file => {
      if (file.type === 'image') {
        product.images.push(file);
      } else {
        product.videos.push(file);
      }
    });

    // Check if product listing is now complete
    product.checkListingCompletion();
    await product.save();

    res.json({
      success: true,
      message: 'Media uploaded successfully',
      uploadedFiles,
      product
    });
  } catch (error) {
    // Clean up uploaded files on error
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Upload failed', 
      error: error.message 
    });
  }
};

// Update product description
exports.updateDescription = async (req, res) => {
  try {
    const { description } = req.body;

    if (!description || description.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Description is required'
      });
    }
    
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id },
      { 
        description: description.trim(),
      },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }

    // Check if product listing is now complete
    product.checkListingCompletion();
    await product.save();

    res.json({
      success: true,
      message: 'Description updated successfully',
      product
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Update failed', 
      error: error.message 
    });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const products = await Product.find()
      .populate('seller', 'name phone profilePicture')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Product.countDocuments();

    res.json({
      success: true,
      products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalProducts: total
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Get seller's products
exports.getMyProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    let filter = { seller: req.user.id };
    
    // Filter by completion status if provided
    if (status === 'complete') {
      filter.isComplete = true;
    } else if (status === 'incomplete') {
      filter.isComplete = false;
    }

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalProducts: total
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Get single product
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('seller', 'name phone profilePicture');

    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }

    res.json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ 
      _id: req.params.id, 
    });

    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }

    // Delete local files
    const deleteFiles = [
      ...product.images.map(img => path.join('uploads/product', img.publicId)),
      ...product.videos.map(video => path.join('uploads/product', video.publicId))
    ];

    deleteFiles.forEach(filePath => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Delete failed', 
      error: error.message 
    });
  }
};

// Remove specific media
exports.removeMedia = async (req, res) => {
  try {
    const product = await Product.findOne({ 
      _id: req.params.id, 
    });

    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }

    const { mediaId } = req.params;
    let mediaItem = null;
    let isImage = false;

    // Check if it's an image or video
    mediaItem = product.images.id(mediaId);
    if (mediaItem) {
      isImage = true;
    } else {
      mediaItem = product.videos.id(mediaId);
    }

    if (!mediaItem) {
      return res.status(404).json({ 
        success: false,
        message: 'Media not found' 
      });
    }

    // Delete local file
    const filePath = path.join('uploads/product', mediaItem.publicId);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Remove from product
    if (isImage) {
      await product.removeImage(mediaId);
    } else {
      await product.removeVideo(mediaId);
    }

    await product.save();

    res.json({
      success: true,
      message: 'Media removed successfully',
      product
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Remove failed', 
      error: error.message 
    });
  }
};

// Check and update product completion status
exports.checkCompletion = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }

    // Check completion status
    const wasComplete = product.isComplete;
    product.checkListingCompletion();
    await product.save();

    res.json({
      success: true,
      message: 'Completion status checked',
      product,
      wasComplete,
      isNowComplete: product.isComplete
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Check failed', 
      error: error.message 
    });
  }
};

// Set primary image
exports.setPrimaryImage = async (req, res) => {
  try {
    const product = await Product.findOne({ 
      _id: req.params.id, 
    });

    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }

    const { imageId } = req.params;
    
    // Reset all images to non-primary
    product.images.forEach(img => img.isPrimary = false);
    
    // Set selected image as primary
    const targetImage = product.images.id(imageId);
    if (!targetImage) {
      return res.status(404).json({ 
        success: false,
        message: 'Image not found' 
      });
    }

    targetImage.isPrimary = true;
    await product.save();

    res.json({
      success: true,
      message: 'Primary image updated successfully',
      product
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Update failed', 
      error: error.message 
    });
  }
};

// Enhance product description
exports.enhanceDescription = async (req, res) => {
  console.log('Enhance description endpoint called');
  try {
    const { description } = req.body;
    console.log('Original description:', description);

    if (!description) {
      console.log('Description is missing');
      return res.status(400).json({
        success: false,
        message: 'Description is required for enhancement.',
      });
    }

    const enhancedDescription = await enhanceWithGemini(description);
    console.log('Enhanced description:', enhancedDescription);

    res.json({
      success: true,
      message: 'Description enhanced successfully',
      enhancedDescription,
    });
  } catch (error) {
    console.error('Error in enhanceDescription controller:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to enhance description',
      error: error.message,
    });
  }
};