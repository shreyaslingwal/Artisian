// import api from './api';
// import { getToken } from './authService';

// // Get the base URL for serving static files (different from API base URL)
// const getBaseURL = () => {
//   // Your server serves static files directly, not through /api
//   return 'http://localhost:5000'; // Your server runs on port 5000
// };

// const getAuthHeaders = () => {
//   const token = getToken();
//   return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
// };

// // Helper function to convert relative image paths to full URLs
// export const getImageUrl = (imagePath) => {
//   if (!imagePath) return null;
  
//   // If it's already a full URL, return as is
//   if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
//     return imagePath;
//   }
  
//   // If it's a relative path, prepend the base URL
//   if (imagePath.startsWith('/uploads/') || imagePath.startsWith('uploads/')) {
//     const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
//     return `${getBaseURL()}${cleanPath}`;
//   }
  
//   // If it's a local file path (shouldn't happen but just in case)
//   if (imagePath.includes('\\') || imagePath.includes('C:')) {
//     console.warn('Detected local file path, this won\'t work in browser:', imagePath);
//     return null;
//   }
  
//   return imagePath;
// };

// export const getProfile = async () => {
//   try {
//     const response = await api.get('/user/profile', getAuthHeaders());
//     const profileData = response.data;
    
//     // Process the profile picture URL if it exists
//     if (profileData.profilePicture) {
//       profileData.profilePicture = getImageUrl(profileData.profilePicture);
//       console.log('Processed profile picture URL:', profileData.profilePicture);
//     }
    
//     return profileData;
//   } catch (error) {
//     console.error('Error fetching profile:', error);
//     throw error;
//   }
// };

// export const selectRole = async (role) => {
//   try {
//     const response = await api.post('/user/select-role', { role }, getAuthHeaders());
//     return response.data;
//   } catch (error) {
//     console.error('Error selecting role:', error);
//     throw error;
//   }
// };

// export const updateProfile = async (formData) => {
//   try {
//     const auth = getAuthHeaders();
//     const response = await api.put('/user/profile', formData, {
//       headers: {
//         ...(auth.headers || {}),
//         'Content-Type': 'multipart/form-data',
//       },
//     });
    
//     // Process the returned image URL if present
//     if (response.data.user.profilePicture) {
//       response.data.user.profilePicture = getImageUrl(response.data.user.profilePicture);
//       console.log('Updated profile picture URL:', response.data.user.profilePicture);
//     }
    
//     return response.data;
//   } catch (error) {
//     console.error('Error updating profile:', error);
//     throw error;
//   }
// };

// // Additional helper function to validate image URL
// export const validateImageUrl = async (imageUrl) => {
//   if (!imageUrl) return false;
  
//   return new Promise((resolve) => {
//     const img = new Image();
//     img.onload = () => resolve(true);
//     img.onerror = () => {
//       console.error('Failed to load image:', imageUrl);
//       resolve(false);
//     };
//     img.src = imageUrl;
//   });
// };

// export const saveProfileData = async (profileData) => {
//   try {
//     const response = await api.post('/user/save-profile', profileData, getAuthHeaders());
//     return response.data;
//   } catch (error) {
//     console.error('Error saving profile data:', error);
//     throw error;
//   }
// };

import api from './api';
import { getToken } from './authService';

// Get the base URL for serving static files (different from API base URL)
const getBaseURL = () => {
  // Your server serves static files directly, not through /api
  const baseURL = 'http://localhost:5000'; // Your server runs on port 5000
  console.log('getBaseURL returning:', baseURL); // Debug log
  return baseURL;
};

const getAuthHeaders = () => {
  const token = getToken();
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

// Helper function to convert relative image paths to full URLs
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it's a relative path, prepend the base URL
  if (imagePath.startsWith('/uploads/') || imagePath.startsWith('uploads/')) {
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `${getBaseURL()}${cleanPath}`;
  }
  
  // If it's a local file path (shouldn't happen but just in case)
  if (imagePath.includes('\\') || imagePath.includes('C:')) {
    console.warn('Detected local file path, this won\'t work in browser:', imagePath);
    return null;
  }
  
  return imagePath;
};

export const getProfile = async () => {
  try {
    const response = await api.get('/user/profile', getAuthHeaders());
    const profileData = response.data;
    
    // Process the profile picture URL if it exists
    if (profileData.profilePicture) {
      profileData.profilePicture = getImageUrl(profileData.profilePicture);
      console.log('Processed profile picture URL:', profileData.profilePicture);
    }
    
    return profileData;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

export const selectRole = async (role) => {
  try {
    const response = await api.post('/user/select-role', { role }, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error selecting role:', error);
    throw error;
  }
};

export const updateProfile = async (formData) => {
  try {
    const auth = getAuthHeaders();
    const response = await api.put('/user/profile', formData, {
      headers: {
        ...(auth.headers || {}),
        'Content-Type': 'multipart/form-data',
      },
    });
    
    // Process the returned image URL if present
    if (response.data.user.profilePicture) {
      response.data.user.profilePicture = getImageUrl(response.data.user.profilePicture);
      console.log('Updated profile picture URL:', response.data.user.profilePicture);
    }
    
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

// ADD THIS: Enhance profile description using Gemini AI
export const enhanceProfileDescription = async (description) => {
  try {
    console.log('Calling profile enhancement API...');
    const response = await api.post('/user/enhance-profile-description', {
      description: description.trim()
    });

    console.log('Profile enhancement API response:', response.data);
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to enhance profile description');
    }

    console.log('Profile enhancement successful');
    return response.data.enhancedDescription;
  } catch (error) {
    console.error('Error enhancing profile description:', error);
    
    // Handle different types of errors
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.response?.status === 400) {
      throw new Error('Invalid description provided for enhancement');
    } else if (error.response?.status === 500) {
      throw new Error('Server error during enhancement. Please try again.');
    } else {
      throw new Error('Failed to enhance description. Please check your connection.');
    }
  }
};

// Additional helper function to validate image URL
export const validateImageUrl = async (imageUrl) => {
  if (!imageUrl) return false;
  
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => {
      console.error('Failed to load image:', imageUrl);
      resolve(false);
    };
    img.src = imageUrl;
  });
};

export const saveProfileData = async (profileData) => {
  try {
    const response = await api.post('/user/save-profile', profileData, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error saving profile data:', error);
    throw error;
  }
};