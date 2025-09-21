// // routes/user.js
// const express = require('express');
// const { body, validationResult } = require('express-validator');
// const User = require('../models/User');
// const auth = require('../middleware/auth');
// const upload = require('../middleware/upload');

// const router = express.Router();

// // Get current user profile
// router.get('/profile', auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id).select('-otp -otpExpires');
//     res.json(user);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Update user profile (supports multipart/form-data for profilePicture)
// router.put('/profile', auth, upload.single('profilePicture'), [
//   body('name').optional().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
//   body('description').optional().isLength({ min: 10, max: 500 }).withMessage('Description must be between 10 and 500 characters')
// ], async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { name, description } = req.body;
//     const user = req.user;

//     if (name) user.name = name;
//     if (description) user.description = description;

//     if (req.file) {
//       user.profilePicture = `/uploads/profiles/${req.file.filename}`;
//     }

//     user.checkProfileCompletion && user.checkProfileCompletion();
//     await user.save();

//     res.json({
//       message: 'Profile updated successfully',
//       user: {
//         id: user._id,
//         phone: user.phone,
//         role: user.role,
//         name: user.name,
//         description: user.description,
//         profilePicture: user.profilePicture,
//         isProfileComplete: user.isProfileComplete
//       }
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Step 3: Select role (buyer or seller)
// router.post('/select-role', auth, [
//   body('role').isIn(['buyer', 'seller']).withMessage('Role must be either buyer or seller')
// ], async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { role } = req.body;
//     const user = req.user;

//     if (!user.isPhoneVerified) {
//       return res.status(400).json({ message: 'Phone not verified' });
//     }

//     user.role = role;
//     user.registrationStep = 3;
//     await user.save();

//     res.json({
//       message: 'Role selected successfully',
//       user: {
//         id: user._id,
//         phone: user.phone,
//         role: user.role,
//         registrationStep: user.registrationStep
//       }
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Step 4: Upload profile picture
// router.post('/upload-picture', auth, upload.single('profilePicture'), async (req, res) => {
//   try {
//     const user = req.user;

//     if (!user.isPhoneVerified || !user.role) {
//       return res.status(400).json({ message: 'Complete previous steps first' });
//     }

//     if (!req.file) {
//       return res.status(400).json({ message: 'Please upload a profile picture' });
//     }

//     user.profilePicture = `/uploads/profiles/${req.file.filename}`;
//     user.registrationStep = 4;
//     await user.save();

//     res.json({
//       message: 'Profile picture uploaded successfully',
//       profilePicture: user.profilePicture,
//       user: {
//         id: user._id,
//         phone: user.phone,
//         role: user.role,
//         profilePicture: user.profilePicture,
//         registrationStep: user.registrationStep
//       }
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Step 5: Add name
// router.post('/add-name', auth, [
//   body('name').isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters')
// ], async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { name } = req.body;
//     const user = req.user;

//     if (!user.isPhoneVerified || !user.role) {
//       return res.status(400).json({ message: 'Complete previous steps first' });
//     }

//     user.name = name;
//     user.registrationStep = 5;
//     await user.save();

//     res.json({
//       message: 'Name added successfully',
//       user: {
//         id: user._id,
//         phone: user.phone,
//         role: user.role,
//         name: user.name,
//         registrationStep: user.registrationStep
//       }
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Step 6: Add description
// router.post('/add-description', auth, [
//   body('description').isLength({ min: 10, max: 500 }).withMessage('Description must be between 10 and 500 characters')
// ], async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { description } = req.body;
//     const user = req.user;

//     if (!user.isPhoneVerified || !user.role || !user.name) {
//       return res.status(400).json({ message: 'Complete previous steps first' });
//     }

//     user.description = description;
//     user.registrationStep = 6;
//     user.checkProfileCompletion();
//     await user.save();

//     res.json({
//       message: 'Profile completed successfully',
//       user: {
//         id: user._id,
//         phone: user.phone,
//         role: user.role,
//         name: user.name,
//         description: user.description,
//         profilePicture: user.profilePicture,
//         registrationStep: user.registrationStep,
//         isProfileComplete: user.isProfileComplete
//       }
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });
// router.get('/:userId', async (req, res) => {
//   try {
//     const { userId } = req.params;
    
//     // Find user by ID, exclude sensitive fields
//     const user = await User.findById(userId).select('-password -otp -otpExpires');
    
//     if (!user) {
//       return res.status(404).json({ 
//         success: false, 
//         message: 'User not found' 
//       });
//     }
    
//     // Return user data
//     res.json(user);
//   } catch (error) {
//     console.error('Error fetching user:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Server error', 
//       error: error.message 
//     });
//   }
// });

// // GET user stats (products, orders, rating)
// router.get('/:userId/stats', async (req, res) => {
//   try {
//     const { userId } = req.params;
    
//     // You can implement these based on your Product and Order models when you create them
//     const stats = {
//       totalProducts: 0, // await Product.countDocuments({ sellerId: userId })
//       totalOrders: 0,   // await Order.countDocuments({ sellerId: userId })
//       rating: 0         // Calculate average rating from reviews
//     };
    
//     res.json(stats);
//   } catch (error) {
//     console.error('Error fetching user stats:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Server error', 
//       error: error.message 
//     });
//   }
// });

// module.exports = router;






// // routes/user.js
// const express = require('express');
// const { body, validationResult } = require('express-validator');
// const User = require('../models/User');
// const auth = require('../middleware/auth');
// const upload = require('../middleware/upload');
// const { enhanceProfileDescription } = require('../utils/gemini'); // Add this import

// const router = express.Router();

// // Get current user profile
// router.get('/profile', auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id).select('-otp -otpExpires');
//     res.json(user);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Update user profile (supports multipart/form-data for profilePicture)
// router.put('/profile', auth, upload.single('profilePicture'), [
//   body('name').optional().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
//   body('description').optional().isLength({ min: 10, max: 500 }).withMessage('Description must be between 10 and 500 characters')
// ], async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { name, description } = req.body;
//     const user = req.user;

//     if (name) user.name = name;
//     if (description) user.description = description;

//     if (req.file) {
//       user.profilePicture = `/uploads/profiles/${req.file.filename}`;
//     }

//     user.checkProfileCompletion && user.checkProfileCompletion();
//     await user.save();

//     res.json({
//       message: 'Profile updated successfully',
//       user: {
//         id: user._id,
//         phone: user.phone,
//         role: user.role,
//         name: user.name,
//         description: user.description,
//         profilePicture: user.profilePicture,
//         isProfileComplete: user.isProfileComplete
//       }
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // ADD THIS: Enhance profile description endpoint
// router.post('/enhance-profile-description', async (req, res) => {
//   console.log('Enhance profile description endpoint called');
//   try {
//     const { description } = req.body;
//     console.log('Original profile description:', description);

//     if (!description || description.trim().length === 0) {
//       console.log('Profile description is missing');
//       return res.status(400).json({
//         success: false,
//         message: 'Profile description is required for enhancement.'
//       });
//     }

//     if (description.trim().length < 10) {
//       return res.status(400).json({
//         success: false,
//         message: 'Profile description must be at least 10 characters long.'
//       });
//     }

//     const enhancedDescription = await enhanceProfileDescription(description);
//     console.log('Enhanced profile description:', enhancedDescription);

//     res.json({
//       success: true,
//       message: 'Profile description enhanced successfully',
//       enhancedDescription,
//       type: 'profile'
//     });
//   } catch (error) {
//     console.error('Error in enhance profile description controller:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to enhance profile description',
//       error: error.message
//     });
//   }
// });

// // Step 3: Select role (buyer or seller)
// router.post('/select-role', auth, [
//   body('role').isIn(['buyer', 'seller']).withMessage('Role must be either buyer or seller')
// ], async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { role } = req.body;
//     const user = req.user;

//     if (!user.isPhoneVerified) {
//       return res.status(400).json({ message: 'Phone not verified' });
//     }

//     user.role = role;
//     user.registrationStep = 3;
//     await user.save();

//     res.json({
//       message: 'Role selected successfully',
//       user: {
//         id: user._id,
//         phone: user.phone,
//         role: user.role,
//         registrationStep: user.registrationStep
//       }
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Step 4: Upload profile picture
// router.post('/upload-picture', auth, upload.single('profilePicture'), async (req, res) => {
//   try {
//     const user = req.user;

//     if (!user.isPhoneVerified || !user.role) {
//       return res.status(400).json({ message: 'Complete previous steps first' });
//     }

//     if (!req.file) {
//       return res.status(400).json({ message: 'Please upload a profile picture' });
//     }

//     user.profilePicture = `/uploads/profiles/${req.file.filename}`;
//     user.registrationStep = 4;
//     await user.save();

//     res.json({
//       message: 'Profile picture uploaded successfully',
//       profilePicture: user.profilePicture,
//       user: {
//         id: user._id,
//         phone: user.phone,
//         role: user.role,
//         profilePicture: user.profilePicture,
//         registrationStep: user.registrationStep
//       }
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Step 5: Add name
// router.post('/add-name', auth, [
//   body('name').isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters')
// ], async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { name } = req.body;
//     const user = req.user;

//     if (!user.isPhoneVerified || !user.role) {
//       return res.status(400).json({ message: 'Complete previous steps first' });
//     }

//     user.name = name;
//     user.registrationStep = 5;
//     await user.save();

//     res.json({
//       message: 'Name added successfully',
//       user: {
//         id: user._id,
//         phone: user.phone,
//         role: user.role,
//         name: user.name,
//         registrationStep: user.registrationStep
//       }
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Step 6: Add description
// router.post('/add-description', auth, [
//   body('description').isLength({ min: 10, max: 500 }).withMessage('Description must be between 10 and 500 characters')
// ], async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { description } = req.body;
//     const user = req.user;

//     if (!user.isPhoneVerified || !user.role || !user.name) {
//       return res.status(400).json({ message: 'Complete previous steps first' });
//     }

//     user.description = description;
//     user.registrationStep = 6;
//     user.checkProfileCompletion();
//     await user.save();

//     res.json({
//       message: 'Profile completed successfully',
//       user: {
//         id: user._id,
//         phone: user.phone,
//         role: user.role,
//         name: user.name,
//         description: user.description,
//         profilePicture: user.profilePicture,
//         registrationStep: user.registrationStep,
//         isProfileComplete: user.isProfileComplete
//       }
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// router.get('/:userId', async (req, res) => {
//   try {
//     const { userId } = req.params;
    
//     // Find user by ID, exclude sensitive fields
//     const user = await User.findById(userId).select('-password -otp -otpExpires');
    
//     if (!user) {
//       return res.status(404).json({ 
//         success: false, 
//         message: 'User not found' 
//       });
//     }
    
//     // Return user data
//     res.json(user);
//   } catch (error) {
//     console.error('Error fetching user:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Server error', 
//       error: error.message 
//     });
//   }
// });

// // GET user stats (products, orders, rating)
// router.get('/:userId/stats', async (req, res) => {
//   try {
//     const { userId } = req.params;
    
//     // You can implement these based on your Product and Order models when you create them
//     const stats = {
//       totalProducts: 0, // await Product.countDocuments({ sellerId: userId })
//       totalOrders: 0,   // await Order.countDocuments({ sellerId: userId })
//       rating: 0         // Calculate average rating from reviews
//     };
    
//     res.json(stats);
//   } catch (error) {
//     console.error('Error fetching user stats:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Server error', 
//       error: error.message 
//     });
//   }
// });

// module.exports = router;




// routes/user.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const { enhanceProfileDescription } = require('../utils/gemini');

const router = express.Router();

// Get current user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-otp -otpExpires');
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile (supports multipart/form-data for profilePicture)
// FIXED: Use upload.profile.single() instead of upload.single()
router.put('/profile', auth, upload.profile.single('profilePicture'), [
  body('name').optional().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('description').optional().isLength({ min: 10, max: 500 }).withMessage('Description must be between 10 and 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description } = req.body;
    const user = req.user;

    if (name) user.name = name;
    if (description) user.description = description;

    if (req.file) {
      user.profilePicture = `/uploads/profiles/${req.file.filename}`;
    }

    user.checkProfileCompletion && user.checkProfileCompletion();
    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        phone: user.phone,
        role: user.role,
        name: user.name,
        description: user.description,
        profilePicture: user.profilePicture,
        isProfileComplete: user.isProfileComplete
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Enhance profile description endpoint
router.post('/enhance-profile-description', async (req, res) => {
  console.log('Enhance profile description endpoint called');
  try {
    const { description } = req.body;
    console.log('Original profile description:', description);

    if (!description || description.trim().length === 0) {
      console.log('Profile description is missing');
      return res.status(400).json({
        success: false,
        message: 'Profile description is required for enhancement.'
      });
    }

    if (description.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Profile description must be at least 10 characters long.'
      });
    }

    const enhancedDescription = await enhanceProfileDescription(description);
    console.log('Enhanced profile description:', enhancedDescription);

    res.json({
      success: true,
      message: 'Profile description enhanced successfully',
      enhancedDescription,
      type: 'profile'
    });
  } catch (error) {
    console.error('Error in enhance profile description controller:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to enhance profile description',
      error: error.message
    });
  }
});

// Step 3: Select role (buyer or seller)
router.post('/select-role', auth, [
  body('role').isIn(['buyer', 'seller']).withMessage('Role must be either buyer or seller')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { role } = req.body;
    const user = req.user;

    if (!user.isPhoneVerified) {
      return res.status(400).json({ message: 'Phone not verified' });
    }

    user.role = role;
    user.registrationStep = 3;
    await user.save();

    res.json({
      message: 'Role selected successfully',
      user: {
        id: user._id,
        phone: user.phone,
        role: user.role,
        registrationStep: user.registrationStep
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Step 4: Upload profile picture
// FIXED: Use upload.profile.single() instead of upload.single()
router.post('/upload-picture', auth, upload.profile.single('profilePicture'), async (req, res) => {
  try {
    const user = req.user;

    if (!user.isPhoneVerified || !user.role) {
      return res.status(400).json({ message: 'Complete previous steps first' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a profile picture' });
    }

    user.profilePicture = `/uploads/profiles/${req.file.filename}`;
    user.registrationStep = 4;
    await user.save();

    res.json({
      message: 'Profile picture uploaded successfully',
      profilePicture: user.profilePicture,
      user: {
        id: user._id,
        phone: user.phone,
        role: user.role,
        profilePicture: user.profilePicture,
        registrationStep: user.registrationStep
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Step 5: Add name
router.post('/add-name', auth, [
  body('name').isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name } = req.body;
    const user = req.user;

    if (!user.isPhoneVerified || !user.role) {
      return res.status(400).json({ message: 'Complete previous steps first' });
    }

    user.name = name;
    user.registrationStep = 5;
    await user.save();

    res.json({
      message: 'Name added successfully',
      user: {
        id: user._id,
        phone: user.phone,
        role: user.role,
        name: user.name,
        registrationStep: user.registrationStep
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Step 6: Add description
router.post('/add-description', auth, [
  body('description').isLength({ min: 10, max: 500 }).withMessage('Description must be between 10 and 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { description } = req.body;
    const user = req.user;

    if (!user.isPhoneVerified || !user.role || !user.name) {
      return res.status(400).json({ message: 'Complete previous steps first' });
    }

    user.description = description;
    user.registrationStep = 6;
    user.checkProfileCompletion();
    await user.save();

    res.json({
      message: 'Profile completed successfully',
      user: {
        id: user._id,
        phone: user.phone,
        role: user.role,
        name: user.name,
        description: user.description,
        profilePicture: user.profilePicture,
        registrationStep: user.registrationStep,
        isProfileComplete: user.isProfileComplete
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Find user by ID, exclude sensitive fields
    const user = await User.findById(userId).select('-password -otp -otpExpires');
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    // Return user data
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// GET user stats (products, orders, rating)
router.get('/:userId/stats', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // You can implement these based on your Product and Order models when you create them
    const stats = {
      totalProducts: 0, // await Product.countDocuments({ sellerId: userId })
      totalOrders: 0,   // await Order.countDocuments({ sellerId: userId })
      rating: 0         // Calculate average rating from reviews
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

module.exports = router;