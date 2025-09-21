// // ============================================
// // 3. routes/productRoutes.js
// // ============================================
// const express = require('express');
// const router = express.Router();
// const productController = require('../controllers/productController');
// const auth = require('../middleware/auth'); // Your existing auth middleware
// const upload = require('../middleware/upload');

// // Create new product
// router.post('/', productController.createProduct);

// // Upload product media (images and videos)
// router.post('/upload-media', upload.product.array('media', 10), productController.uploadMedia);
// router.post('/:id/upload-media', upload.product.array('media', 10), productController.uploadMedia);

// // Update product description
// router.put('/:id/description', productController.updateDescription);

// // Get seller's products
// router.get('/my-products', auth, productController.getMyProducts);

// // Get single product
// router.get('/:id', productController.getProduct);

// // Delete product
// router.delete('/:id', productController.deleteProduct);

// // Remove specific image/video
// router.delete('/:id/media/:mediaId', productController.removeMedia);

// // Set primary image
// router.put('/:id/primary-image/:imageId', productController.setPrimaryImage);

// module.exports = router;




// ============================================
// routes/productRoutes.js
// ============================================
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/auth'); // Your existing auth middleware
const upload = require('../middleware/upload');

// Get all products (must come before /:id routes to avoid conflicts)
router.get('/', productController.getAllProducts);

// Create new product
router.post('/', productController.createProduct);

// Enhance product description
router.post('/enhance-description', productController.enhanceDescription);

// Upload product media (images and videos) - ONLY the parameterized route
router.post('/:id/upload-media', upload.product.array('media', 10), productController.uploadMedia);

// Update product description
router.put('/:id/description', productController.updateDescription);

// Get seller's products
router.get('/my-products', auth, productController.getMyProducts);

// Get single product
router.get('/:id', productController.getProduct);

// Update entire product
router.put('/:id', productController.updateDescription);

// Delete product
router.delete('/:id', productController.deleteProduct);

// Remove specific image/video
router.delete('/:id/media/:mediaId', productController.removeMedia);

// Set primary image
router.put('/:id/primary-image/:imageId', productController.setPrimaryImage);

// Check completion status
router.put('/:id/check-completion', productController.checkCompletion);

module.exports = router;