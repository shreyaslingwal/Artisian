export const isValidPhone = (phoneNumber) => {
  if (!phoneNumber) return false;
  
  // Remove all non-digit characters to count digits
  const digitsOnly = phoneNumber.replace(/\D/g, '');
  
  // Check if exactly 10 digits
  if (digitsOnly.length !== 10) return false;
  
  // Check if it starts with 6, 7, 8, or 9 (Indian mobile numbers)
  const firstDigit = digitsOnly[0];
  return ['6', '7', '8', '9'].includes(firstDigit);
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateRequired = (value) => {
  return typeof value === 'string' && value.trim().length > 0;
};

// Validation for required fields
export const validateRequiredFields = (profileData) => {
  const errors = {};
  
  // Name validation (min 2 characters)
  if (!validateRequired(profileData.name)) {
    errors.name = 'Name is required';
  } else if (profileData.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }
  
  // Phone validation (keeping this for backward compatibility)
  if (profileData.phone !== undefined) {
    if (!validateRequired(profileData.phone)) {
      errors.phone = 'Phone number is required';
    } else if (!isValidPhone(profileData.phone)) {
      errors.phone = 'Phone number must be exactly 10 digits';
    }
  }
  
  // Description validation (min 10 characters)
  if (!validateRequired(profileData.description)) {
    errors.description = 'Description is required';
  } else if (profileData.description.trim().length < 10) {
    errors.description = 'Description must be at least 10 characters';
  }
  
  return errors;
};

// Check if a specific step has validation errors - FIXED to match actual steps
export const hasStepValidationErrors = (step, profileData) => {
  const errors = validateRequiredFields(profileData);
  
  switch (step) {
    case 0: // Photo Upload - no validation required
      return false;
    case 1: // Basic Information (Name)
      return !!errors.name;
    case 2: // Description - FIXED: was checking phone, now checks description
      return !!errors.description;
    case 3: // Review - no validation required
      return false;
    default:
      return false;
  }
};