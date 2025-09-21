// // src/components/ProfileSetup/ProfileField.jsx
// import React, { useEffect, useState, useRef } from 'react';
// import { Mic, MicOff, Sparkles } from 'lucide-react';
// import { isValidPhone, validateRequired } from '../../utils/validation';
// import '../../styles/components/ProfileField.css';

// const ProfileField = ({
//   label,
//   field,
//   placeholder,
//   type = "input",
//   htmlType = "text",
//   disableVoice = false,
//   profileData,
//   handleInputChange,
//   voiceEnabled,
//   speechSupported,
//   isListening,
//   isProcessing,
//   startListening,
//   stopListening,
//   detectedLanguage,
//   enhancedDescription,
//   geminiSuggestions,
//   setProfileData
// }) => {
//   const [isAutoEnhancing, setIsAutoEnhancing] = useState(false);
//   const [hasBeenEnhanced, setHasBeenEnhanced] = useState(false);
//   const previousIsListening = useRef(isListening);
//   const enhancementTimeoutRef = useRef(null);

//   // Auto-enhance when user stops speaking (voice input) or stops typing
//   useEffect(() => {
//     // Check if user just stopped speaking (voice input ended)
//     const justStoppedSpeaking = previousIsListening.current && !isListening;
//     previousIsListening.current = isListening;

//     if (field === 'description' && 
//         profileData[field] && 
//         profileData[field].length > 10 && 
//         !hasBeenEnhanced &&
//         !profileData[field].includes('With expertise in cutting-edge technologies')) {
      
//       // Clear any existing timeout
//       if (enhancementTimeoutRef.current) {
//         clearTimeout(enhancementTimeoutRef.current);
//       }

//       // If user just stopped speaking, enhance immediately
//       // Otherwise, wait for them to stop typing
//       const delay = justStoppedSpeaking ? 500 : 2000;
      
//       enhancementTimeoutRef.current = setTimeout(() => {
//         setIsAutoEnhancing(true);
        
//         // Mock auto-enhancement - replace with actual API call
//         setTimeout(() => {
//           const originalText = profileData[field];
//           const enhancedText = `${originalText} With expertise in cutting-edge technologies and a passion for innovation, bringing unique value to every project through creative problem-solving and collaborative leadership.`;
          
//           // Automatically update the description with enhanced version
//           setProfileData(prev => ({ 
//             ...prev, 
//             [field]: enhancedText 
//           }));
          
//           setIsAutoEnhancing(false);
//           setHasBeenEnhanced(true); // Mark as enhanced to prevent multiple enhancements
//         }, 1500); // Simulate API delay
//       }, delay);
//     }

//     return () => {
//       if (enhancementTimeoutRef.current) {
//         clearTimeout(enhancementTimeoutRef.current);
//       }
//     };
//   }, [profileData[field], field, setProfileData, isListening, hasBeenEnhanced]);

//   // Reset enhancement flag when description is cleared or significantly changed
//   useEffect(() => {
//     if (field === 'description' && (!profileData[field] || profileData[field].length < 10)) {
//       setHasBeenEnhanced(false);
//     }
//   }, [profileData[field], field]);

//   // Get validation error for current field
//   const getValidationError = () => {
//     const value = profileData[field];
    
//     // Required field validation
//     const requiredFields = ['name', 'phone', 'description'];
//     if (requiredFields.includes(field) && !validateRequired(value)) {
//       return `${label} is required`;
//     }
    
//     // Phone specific validation
//     if (field === 'phone' && value) {
//       if (!isValidPhone(value)) {
//         return 'Phone number must be exactly 10 digits';
//       }
//     }
    
//     return null;
//   };

//   const validationError = getValidationError();
//   const hasError = !!validationError;

//   return (
//     <div className="form-group">
//       {/* Only show label for name field */}
//       {field === "name" && (
//         <label htmlFor={field} className="form-label">
//           {label} <span className="required">*</span>
//         </label>
//       )}

//       <div className="input-container">
//         {type === "input" ? (
//           <input
//             id={field}
//             type={htmlType}
//             inputMode={htmlType === 'tel' ? 'numeric' : undefined}
//             pattern={htmlType === 'tel' ? '[0-9+ -]+' : undefined}
//             value={profileData[field]}
//             onChange={(e) => handleInputChange(field, e.target.value)}
//             placeholder={placeholder}
//             className={`form-input ${hasError ? 'error' : ''}`}
//           />
//         ) : (
//           <textarea
//             id={field}
//             value={profileData[field]}
//             onChange={(e) => handleInputChange(field, e.target.value)}
//             placeholder={placeholder}
//             className={`form-textarea ${hasError ? 'error' : ''}`}
//           />
//         )}

//         {voiceEnabled && speechSupported && !disableVoice && (
//           <button
//             onClick={() => isListening ? stopListening() : startListening(field)}
//             className={`voice-button ${isListening ? 'listening' : ''}`}
//             title={isListening ? 'Stop listening' : 'Start voice input'}
//           >
//             {isListening ? <MicOff size={16} /> : <Mic size={16} />}
//           </button>
//         )}

//         {(isProcessing || isAutoEnhancing) && (
//           <div className="ai-indicator">
//             <Sparkles size={12} />
//             AI
//           </div>
//         )}
//       </div>

//       {/* Validation/Error feedback space to prevent layout shift */}
//       <div className="field-feedback">
//         {hasError && field !== 'name' && field !== 'description' && (
//           <div className="error-message">
//             {validationError}
//           </div>
//         )}
//       </div>

//       {/* Auto-enhancement indicator for description field */}
//       {isAutoEnhancing && field === 'description' && (
//         <div className="auto-enhancing-indicator">
//           <Sparkles size={12} />
//           AI is enhancing your description...
//         </div>
//       )}

//       {/* Listening Indicator */}
//       {isListening && !disableVoice && (
//         <div className="listening-indicator">
//           <div className="listening-dot"></div>
//           🎤 Listening... Speak clearly into your microphone
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProfileField;












// src/components/ProfileSetup/ProfileField.jsx
// import React, { useEffect, useState, useRef } from 'react';
// import { Mic, MicOff, Sparkles, CheckCircle, XCircle } from 'lucide-react';
// import { isValidPhone, validateRequired } from '../../utils/validation';
// import { enhanceProfileDescription } from '../../services/userServices'; // Import the API function
// import '../../styles/components/ProfileField.css';

// const ProfileField = ({
//   label,
//   field,
//   placeholder,
//   type = "input",
//   htmlType = "text",
//   disableVoice = false,
//   profileData,
//   handleInputChange,
//   voiceEnabled,
//   speechSupported,
//   isListening,
//   isProcessing,
//   startListening,
//   stopListening,
//   detectedLanguage,
//   enhancedDescription,
//   geminiSuggestions,
//   setProfileData
// }) => {
//   const [isAutoEnhancing, setIsAutoEnhancing] = useState(false);
//   const [hasBeenEnhanced, setHasBeenEnhanced] = useState(false);
//   const [enhancementError, setEnhancementError] = useState(null);
//   const [showEnhancementSuccess, setShowEnhancementSuccess] = useState(false);
//   const previousIsListening = useRef(isListening);
//   const enhancementTimeoutRef = useRef(null);

//   // Auto-enhance when user stops speaking (voice input) or stops typing
//   useEffect(() => {
//     // Only auto-enhance for description field
//     if (field !== 'description') return;

//     // Check if user just stopped speaking (voice input ended)
//     const justStoppedSpeaking = previousIsListening.current && !isListening;
//     previousIsListening.current = isListening;

//     const description = profileData[field] || '';
    
//     // Check if description is ready for enhancement
//     const shouldEnhance = description.length > 10 && 
//                          !hasBeenEnhanced && 
//                          !isAutoEnhancing &&
//                          // Don't enhance if it already looks enhanced (contains certain keywords)
//                          !description.includes('expertise') &&
//                          !description.includes('passionate') &&
//                          !description.includes('innovative');

//     if (shouldEnhance) {
//       // Clear any existing timeout
//       if (enhancementTimeoutRef.current) {
//         clearTimeout(enhancementTimeoutRef.current);
//       }

//       // If user just stopped speaking, enhance immediately
//       // Otherwise, wait for them to stop typing
//       const delay = justStoppedSpeaking ? 500 : 2000;
      
//       enhancementTimeoutRef.current = setTimeout(async () => {
//         setIsAutoEnhancing(true);
//         setEnhancementError(null);
        
//         try {
//           console.log('Starting Gemini enhancement for profile description...');
//           const enhancedText = await enhanceProfileDescription(description);
          
//           // Update the description with enhanced version
//           setProfileData(prev => ({ 
//             ...prev, 
//             [field]: enhancedText,
//             enhancedDescription: enhancedText,
//             originalDescription: description // Keep track of original
//           }));
          
//           setHasBeenEnhanced(true);
//           setShowEnhancementSuccess(true);
          
//           // Hide success message after 3 seconds
//           setTimeout(() => {
//             setShowEnhancementSuccess(false);
//           }, 3000);
          
//           console.log('Profile description enhanced successfully');
//         } catch (error) {
//           console.error('Failed to enhance profile description:', error);
//           setEnhancementError('Failed to enhance description. Please try again.');
          
//           // Clear error after 5 seconds
//           setTimeout(() => {
//             setEnhancementError(null);
//           }, 5000);
//         } finally {
//           setIsAutoEnhancing(false);
//         }
//       }, delay);
//     }

//     return () => {
//       if (enhancementTimeoutRef.current) {
//         clearTimeout(enhancementTimeoutRef.current);
//       }
//     };
//   }, [profileData[field], field, setProfileData, isListening, hasBeenEnhanced, isAutoEnhancing]);

//   // Reset enhancement flag when description is cleared or significantly changed
//   useEffect(() => {
//     if (field === 'description') {
//       const currentValue = profileData[field] || '';
//       if (currentValue.length < 10) {
//         setHasBeenEnhanced(false);
//         setEnhancementError(null);
//         setShowEnhancementSuccess(false);
//       }
//     }
//   }, [profileData[field], field]);

//   // Get validation error for current field
//   const getValidationError = () => {
//     const value = profileData[field];
    
//     // Required field validation
//     const requiredFields = ['name', 'description'];
//     if (requiredFields.includes(field) && !validateRequired(value)) {
//       return `${label} is required`;
//     }
    
//     // Phone specific validation
//     if (field === 'phone' && value) {
//       if (!isValidPhone(value)) {
//         return 'Phone number must be exactly 10 digits';
//       }
//     }
    
//     return null;
//   };

//   // Manual enhancement function (optional - can be triggered by a button)
//   const handleManualEnhancement = async () => {
//     const description = profileData[field] || '';
//     if (description.length < 10) {
//       setEnhancementError('Please write at least 10 characters before enhancing.');
//       return;
//     }

//     setIsAutoEnhancing(true);
//     setEnhancementError(null);
    
//     try {
//       const enhancedText = await enhanceProfileDescription(description);
      
//       setProfileData(prev => ({ 
//         ...prev, 
//         [field]: enhancedText,
//         enhancedDescription: enhancedText,
//         originalDescription: description
//       }));
      
//       setHasBeenEnhanced(true);
//       setShowEnhancementSuccess(true);
      
//       setTimeout(() => {
//         setShowEnhancementSuccess(false);
//       }, 3000);
      
//     } catch (error) {
//       console.error('Failed to enhance profile description:', error);
//       setEnhancementError('Failed to enhance description. Please try again.');
//     } finally {
//       setIsAutoEnhancing(false);
//     }
//   };

//   const validationError = getValidationError();
//   const hasError = !!validationError;

//   return (
//     <div className="form-group">
//       {/* Only show label for name field */}
//       {field === "name" && (
//         <label htmlFor={field} className="form-label">
//           {label} <span className="required">*</span>
//         </label>
//       )}

//       <div className="input-container">
//         {type === "input" ? (
//           <input
//             id={field}
//             type={htmlType}
//             inputMode={htmlType === 'tel' ? 'numeric' : undefined}
//             pattern={htmlType === 'tel' ? '[0-9+ -]+' : undefined}
//             value={profileData[field] || ''}
//             onChange={(e) => handleInputChange(field, e.target.value)}
//             placeholder={placeholder}
//             className={`form-input ${hasError ? 'error' : ''}`}
//           />
//         ) : (
//           <textarea
//             id={field}
//             value={profileData[field] || ''}
//             onChange={(e) => handleInputChange(field, e.target.value)}
//             placeholder={placeholder}
//             className={`form-textarea ${hasError ? 'error' : ''} ${hasBeenEnhanced ? 'enhanced' : ''}`}
//             rows={4}
//           />
//         )}

//         {voiceEnabled && speechSupported && !disableVoice && (
//           <button
//             onClick={() => isListening ? stopListening() : startListening(field)}
//             className={`voice-button ${isListening ? 'listening' : ''}`}
//             title={isListening ? 'Stop listening' : 'Start voice input'}
//           >
//             {isListening ? <MicOff size={16} /> : <Mic size={16} />}
//           </button>
//         )}

//         {/* AI Enhancement Indicators */}
//         {(isProcessing || isAutoEnhancing) && (
//           <div className="ai-indicator processing">
//             <Sparkles size={12} className="sparkles-rotating" />
//             <span>AI</span>
//           </div>
//         )}

//         {showEnhancementSuccess && (
//           <div className="ai-indicator success">
//             <CheckCircle size={12} />
//             <span>Enhanced</span>
//           </div>
//         )}

//         {enhancementError && (
//           <div className="ai-indicator error">
//             <XCircle size={12} />
//             <span>Error</span>
//           </div>
//         )}
//       </div>

//       {/* Manual Enhancement Button for Description Field */}
//       {field === 'description' && !hasBeenEnhanced && !isAutoEnhancing && profileData[field] && profileData[field].length > 10 && (
//         <button 
//           onClick={handleManualEnhancement}
//           className="enhance-button manual"
//           disabled={isAutoEnhancing}
//         >
//           <Sparkles size={14} />
//           Enhance with AI
//         </button>
//       )}

//       {/* Validation/Error feedback space to prevent layout shift */}
//       <div className="field-feedback">
//         {hasError && field !== 'name' && field !== 'description' && (
//           <div className="error-message">
//             {validationError}
//           </div>
//         )}
        
//         {enhancementError && (
//           <div className="error-message">
//             {enhancementError}
//           </div>
//         )}
//       </div>

//       {/* Auto-enhancement indicator for description field */}
//       {isAutoEnhancing && field === 'description' && (
//         <div className="auto-enhancing-indicator">
//           <Sparkles size={12} className="sparkles-rotating" />
//           AI is enhancing your profile description...
//         </div>
//       )}

//       {/* Enhancement success message */}
//       {showEnhancementSuccess && field === 'description' && (
//         <div className="enhancement-success-indicator">
//           <CheckCircle size={12} />
//           Your profile description has been enhanced with AI!
//         </div>
//       )}

//       {/* Listening Indicator */}
//       {isListening && !disableVoice && (
//         <div className="listening-indicator">
//           <div className="listening-dot"></div>
//           🎤 Listening... Speak clearly into your microphone
//         </div>
//       )}

//       {/* Show enhancement status for description field */}
//       {field === 'description' && hasBeenEnhanced && !showEnhancementSuccess && (
//         <div className="enhancement-status">
//           <CheckCircle size={12} />
//           <span>AI Enhanced</span>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProfileField;






// src/components/ProfileSetup/ProfileField.jsx
import React, { useEffect, useState, useRef } from 'react';
import { Mic, MicOff, Sparkles, CheckCircle, XCircle } from 'lucide-react';
import { isValidPhone, validateRequired } from '../../utils/validation';
import { enhanceProfileDescription } from '../../services/userServices';
import '../../styles/components/ProfileField.css';

const ProfileField = ({
  label,
  field,
  placeholder,
  type = "input",
  htmlType = "text",
  disableVoice = false,
  profileData,
  handleInputChange,
  voiceEnabled,
  speechSupported,
  isListening,
  isProcessing,
  startListening,
  stopListening,
  detectedLanguage,
  enhancedDescription,
  geminiSuggestions,
  setProfileData,
  triggerEnhancement = false, // New prop to trigger enhancement from parent
  onEnhancementComplete // Callback when enhancement is done
}) => {
  const [isAutoEnhancing, setIsAutoEnhancing] = useState(false);
  const [hasBeenEnhanced, setHasBeenEnhanced] = useState(false);
  const [enhancementError, setEnhancementError] = useState(null);
  const [showEnhancementSuccess, setShowEnhancementSuccess] = useState(false);
  
  // Local voice recognition state
  const [localIsListening, setLocalIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const recognitionRef = useRef(null);
  const enhancementTriggeredRef = useRef(false);

  // Initialize speech recognition with better error handling
  useEffect(() => {
    if (speechSupported && !recognitionRef.current) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          recognitionRef.current = new SpeechRecognition();
          recognitionRef.current.continuous = true; // Set to true for continuous listening
          recognitionRef.current.interimResults = false;
          recognitionRef.current.lang = 'en-US';

          recognitionRef.current.onstart = () => {
            setLocalIsListening(true);
            setVoiceError(null);
            setPermissionDenied(false);
            console.log('Voice recognition started for field:', field);
          };

          recognitionRef.current.onresult = (event) => {
            const transcript = event.results[0][0].transcript.trim();
            console.log('Voice input received:', transcript);
            handleInputChange(field, transcript);
            setLocalIsListening(false);
            setVoiceError(null);
          };

          recognitionRef.current.onerror = (event) => {
            console.error('Voice recognition error:', event.error);
            setLocalIsListening(false);
            
            switch(event.error) {
              case 'not-allowed':
                setPermissionDenied(true);
                setVoiceError('Microphone access denied. Please allow microphone permissions.');
                break;
              case 'no-speech':
                setVoiceError('No speech detected. Please try again.');
                break;
              case 'audio-capture':
                setVoiceError('Microphone not found. Please check your microphone.');
                break;
              case 'network':
                setVoiceError('Network error. Please check your internet connection.');
                break;
              default:
                setVoiceError(`Voice recognition error: ${event.error}`);
            }
          };

          recognitionRef.current.onend = () => {
            setLocalIsListening(false);
            console.log('Voice recognition ended');
          };
        } catch (error) {
          console.error('Failed to initialize speech recognition:', error);
          setVoiceError('Speech recognition not available in this browser.');
        }
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.log('Error stopping recognition:', error);
        }
      }
    };
  }, [speechSupported, field, handleInputChange]);

  // Handle enhancement trigger from parent (when Next is clicked)
  useEffect(() => {
    if (triggerEnhancement && field === 'description' && !enhancementTriggeredRef.current) {
      enhancementTriggeredRef.current = true;
      handleEnhancement();
    }
  }, [triggerEnhancement, field]);

  // Reset enhancement trigger flag when field changes
  useEffect(() => {
    enhancementTriggeredRef.current = false;
  }, [profileData[field]]);

  const handleEnhancement = async () => {
    const description = profileData[field] || '';
    
    // Only enhance if we have enough content and haven't enhanced yet
    if (description.length < 10) {
      if (onEnhancementComplete) onEnhancementComplete();
      return;
    }

    // Check if already enhanced
    if (hasBeenEnhanced || description.includes('expertise') || 
        description.includes('passionate') || description.includes('innovative') ||
        description.includes('dedicated') || description.includes('experienced')) {
      if (onEnhancementComplete) onEnhancementComplete();
      return;
    }

    setIsAutoEnhancing(true);
    setEnhancementError(null);
    
    try {
      console.log('Starting Gemini enhancement for profile description...');
      const enhancedText = await enhanceProfileDescription(description);
      
      setProfileData(prev => ({ 
        ...prev, 
        [field]: enhancedText
      }));
      
      setHasBeenEnhanced(true);
      setShowEnhancementSuccess(true);
      
      setTimeout(() => {
        setShowEnhancementSuccess(false);
      }, 3000);
      
      console.log('Profile description enhanced successfully');
    } catch (error) {
      console.error('Failed to enhance profile description:', error);
      setEnhancementError(error.message || 'Failed to enhance description. Please try again.');
      
      setTimeout(() => {
        setEnhancementError(null);
      }, 5000);
    } finally {
      setIsAutoEnhancing(false);
      if (onEnhancementComplete) onEnhancementComplete();
    }
  };

  // Local voice toggle function with better error handling
  const handleVoiceToggle = async () => {
    if (!speechSupported || !recognitionRef.current) {
      setVoiceError('Speech recognition not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (localIsListening) {
      try {
        recognitionRef.current.stop();
        setLocalIsListening(false);
      } catch (error) {
        console.error('Error stopping voice recognition:', error);
      }
    } else {
      try {
        // Clear previous errors
        setVoiceError(null);
        setPermissionDenied(false);
        
        // Check for microphone permissions first
        if (navigator.permissions) {
          try {
            const permission = await navigator.permissions.query({ name: 'microphone' });
            if (permission.state === 'denied') {
              setPermissionDenied(true);
              setVoiceError('Microphone access denied. Please enable microphone permissions in your browser settings.');
              return;
            }
          } catch (permError) {
            console.log('Permission check not supported:', permError);
          }
        }

        recognitionRef.current.start();
      } catch (error) {
        console.error('Failed to start voice recognition:', error);
        if (error.name === 'InvalidStateError') {
          setVoiceError('Voice recognition is already running. Please wait and try again.');
        } else {
          setVoiceError('Failed to start voice recognition. Please try again.');
        }
      }
    }
  };

  // Reset enhancement status when description is significantly changed
  useEffect(() => {
    if (field === 'description') {
      const currentValue = profileData[field] || '';
      if (currentValue.length < 10) {
        setHasBeenEnhanced(false);
        setEnhancementError(null);
        setShowEnhancementSuccess(false);
        enhancementTriggeredRef.current = false;
      }
    }
  }, [profileData[field], field]);

  const getValidationError = () => {
    const value = profileData[field];
    
    const requiredFields = ['name', 'description'];
    if (requiredFields.includes(field) && !validateRequired(value)) {
      return `${label} is required`;
    }
    
    if (field === 'phone' && value) {
      if (!isValidPhone(value)) {
        return 'Phone number must be exactly 10 digits';
      }
    }
    
    return null;
  };

  const validationError = getValidationError();
  const hasError = !!validationError;

  return (
    <div className="form-group">
      {field === "name" && (
        <label htmlFor={field} className="form-label">
          {label} <span className="required">*</span>
        </label>
      )}

      <div className="input-container">
        {type === "input" ? (
          <input
            id={field}
            type={htmlType}
            inputMode={htmlType === 'tel' ? 'numeric' : undefined}
            pattern={htmlType === 'tel' ? '[0-9+ -]+' : undefined}
            value={profileData[field] || ''}
            onChange={(e) => {
              console.log('Input change:', field, e.target.value);
              handleInputChange(field, e.target.value);
            }}
            placeholder={placeholder}
            className={`form-input ${hasError ? 'error' : ''}`}
          />
        ) : (
          <textarea
            id={field}
            value={profileData[field] || ''}
            onChange={(e) => {
              console.log('Textarea change:', field, e.target.value);
              handleInputChange(field, e.target.value);
            }}
            placeholder={placeholder}
            className={`form-textarea ${hasError ? 'error' : ''} ${hasBeenEnhanced ? 'enhanced' : ''}`}
            rows={4}
          />
        )}

        {/* Voice Button with better state indication */}
        {speechSupported && !disableVoice && (
          <button
            onClick={handleVoiceToggle}
            className={`voice-button ${localIsListening ? 'listening' : ''} ${permissionDenied ? 'error' : ''}`}
            title={
              permissionDenied 
                ? 'Microphone access denied' 
                : localIsListening 
                ? 'Stop listening' 
                : 'Start voice input'
            }
            disabled={permissionDenied}
          >
            {localIsListening ? <MicOff size={16} /> : <Mic size={16} />}
          </button>
        )}

        {/* AI Enhancement Indicators */}
        {(isProcessing || isAutoEnhancing) && (
          <div className="ai-indicator processing">
            <Sparkles size={12} className="sparkles-rotating" />
            <span>AI</span>
          </div>
        )}

        {showEnhancementSuccess && (
          <div className="ai-indicator success">
            <CheckCircle size={12} />
            <span>Enhanced</span>
          </div>
        )}

        {(enhancementError || voiceError) && (
          <div className="ai-indicator error">
            <XCircle size={12} />
            <span>Error</span>
          </div>
        )}
      </div>

      {/* Error/Feedback Section */}
      <div className="field-feedback">
        {hasError && field !== 'name' && field !== 'description' && (
          <div className="error-message">
            {validationError}
          </div>
        )}
        
        {enhancementError && (
          <div className="error-message">
            {enhancementError}
          </div>
        )}
        
        {voiceError && (
          <div className="error-message">
            {voiceError}
            {permissionDenied && (
              <div className="error-help">
                <small>Go to browser settings → Privacy → Microphone and allow access for this site.</small>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Status Indicators */}
      {isAutoEnhancing && field === 'description' && (
        <div className="auto-enhancing-indicator">
          <Sparkles size={12} className="sparkles-rotating" />
          AI is enhancing your profile description...
        </div>
      )}

      {showEnhancementSuccess && field === 'description' && (
        <div className="enhancement-success-indicator">
          <CheckCircle size={12} />
          Your profile description has been enhanced with AI!
        </div>
      )}

      {/* Voice Listening Indicator */}
      {localIsListening && !disableVoice && (
        <div className="listening-indicator">
          <div className="listening-dot"></div>
          Listening... Speak clearly into your microphone
        </div>
      )}

      {field === 'description' && hasBeenEnhanced && !showEnhancementSuccess && (
        <div className="enhancement-status">
          <CheckCircle size={12} />
          <span>AI Enhanced</span>
        </div>
      )}
    </div>
  );
};

export default ProfileField;