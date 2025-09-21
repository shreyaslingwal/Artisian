// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// // Create uploads directory if it doesn't exist
// const uploadDir = 'uploads/profiles';
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, uploadDir);
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
//   }
// });

// const fileFilter = (req, file, cb) => {
//   // Accept only image files
//   if (file.mimetype.startsWith('image/')) {
//     cb(null, true);
//   } else {
//     cb(new Error('Only image files are allowed!'), false);
//   }
// };

// const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter,
//   limits: {
//     fileSize: 5 * 1024 * 1024, // 5MB limit
//   },
// });

// module.exports = upload;

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const ensureDirExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Create base upload directories
ensureDirExists('uploads');
ensureDirExists('uploads/profiles');
ensureDirExists('uploads/product');

// Storage for profile pictures
const profileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/profiles');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Storage for product media
const productStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/product');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for images (for profiles and products)
const imageFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// File filter for product media (images and videos)
const productMediaFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only images and videos are allowed!'), false);
  }
};

// Multer instance for profile picture uploads
const uploadProfile = multer({
  storage: profileStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit for profile pictures
  },
});

// Multer instance for product media uploads
const uploadProduct = multer({
  storage: productStorage,
  fileFilter: productMediaFileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit per file for product media
    files: 10 // Maximum 10 files for product media
  },
  onError: function(err, next) {
    console.error('Multer product upload error:', err);
    next(err);
  }
});

module.exports = {
  profile: uploadProfile,
  product: uploadProduct,
  // You can also export single/array methods directly if needed
  singleProfile: uploadProfile.single.bind(uploadProfile),
  singleProduct: uploadProduct.single.bind(uploadProduct),
  arrayProduct: uploadProduct.array.bind(uploadProduct),
};
