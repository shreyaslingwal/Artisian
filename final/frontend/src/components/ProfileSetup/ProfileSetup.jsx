// import React, { useState, useEffect, useRef } from 'react';
// import { User, Sparkles, CheckCircle, Mic, MicOff } from 'lucide-react';
// import { useProfileData } from '../../hooks/useProfileData';
// import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
// import { useTextToSpeech } from '../../hooks/useTextToSpeech';
// import ProgressBar from './ProgressBar';
// import PhotoUpload from './PhotoUpload';
// import ProfileField from './ProfileField';
// import Navigation from './Navigation';

// import ProfilePreview from './ProfilePreview';
// import BuyerDashboard from '../Buyer/BuyerDashboard';
// import SellerDashboard from '../Seller/SellerDashboard'; 
// import LoadingSpinner from '../common/LoadingSpinner';
// import { useNavigate } from 'react-router-dom';

// import { getProfile, updateProfile } from '../../services/userServices';
// import '../../styles/components/ProfileSetup.css';

// const ProfileSetup = ({ user, onProfileComplete }) => {
//   const {
//     profileData,
//     currentStep,
//     photoPreview,
//     isProcessing,
//     geminiSuggestions,
//     handleInputChange,
//     handlePhotoUpload,
//     removePhoto,
//     nextStep,
//     prevStep,
//     setProfileData
//   } = useProfileData();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (user && user.role === 'seller') {
//       getProfile().then(profile => setProfileData(profile));
//     } 
//   }, [user, setProfileData]);

//   const [voiceAssistantActive, setVoiceAssistantActive] = useState(false);
//   const [language, setLanguage] = useState('en-US');
//   const [promptRepeatTimeout, setPromptRepeatTimeout] = useState(null);
//   const [hasSpokenForNonFieldStep, setHasSpokenForNonFieldStep] = useState(false);
//   const [userHasInteracted, setUserHasInteracted] = useState(false);
  
//   // Add enhancement trigger states
//   const [enhancementTrigger, setEnhancementTrigger] = useState(false);
//   const [enhancementCallback, setEnhancementCallback] = useState(null);
  
//   const hasSpokenForCurrentStep = useRef(false);
//   const lastSpokenStep = useRef(-1);
//   const lastSpokenFieldValue = useRef('');

//   const handleVoiceInput = async (field, value) => {
//     try {
//       await handleInputChange(field, value);
//       setUserHasInteracted(true);
//       if (voiceAssistantActive) {
//         setTimeout(() => nextStep(), 1000);
//       }
//     } catch (error) {
//       console.error('Error handling voice input:', error);
//     }
//   };

//   const {
//     isListening,
//     voiceEnabled,
//     speechSupported,
//     startListening,
//     stopListening,
//     setLanguage: setRecognitionLanguage,
//     setOnInputReceived,
//     setOnPromptNeeded,
//   } = useSpeechRecognition(handleVoiceInput, profileData);

//   const { isSpeaking, speak } = useTextToSpeech();

//   // Function to trigger enhancement
//   const handleTriggerEnhancement = (callback) => {
//     setEnhancementCallback(() => callback);
//     setEnhancementTrigger(true);
//   };

//   // Reset enhancement trigger
//   const handleEnhancementComplete = () => {
//     setEnhancementTrigger(false);
//     if (enhancementCallback) {
//       enhancementCallback();
//       setEnhancementCallback(null);
//     }
//   };

//   const prompts = {
//     'en-US': [
//       "Please upload a beautiful picture of yourself.",
//       "Please say your name.",
//       "Now, tell us a little bit about yourself.",
//       "Please review your profile and submit when you're ready."
//     ],
//     'hi-IN': [
//       "कृपया अपनी एक सुंदर तस्वीर अपलोड करें।",
//       "कृपया अपना नाम बताएं।",
//       "अब, हमें अपने बारे में कुछ बताएं।",
//       "कृपया अपनी प्रोफ़ाइल की समीक्षा करें और जब आप तैयार हों तो सबमिट करें।"
//     ]
//   };

//   useEffect(() => {
//     setOnInputReceived((field, transcript) => {
//       console.log(`Voice input received for ${field}: ${transcript}`);
//       hasSpokenForCurrentStep.current = false;
//       lastSpokenFieldValue.current = transcript;
//       setUserHasInteracted(true);
//     });

//     setOnPromptNeeded((field) => {
//       console.log(`Prompt repeat requested for field: ${field}`);
//       const stepIndex = stepsConfig.findIndex(step => step.field === field);
//       if (stepIndex !== -1 && voiceAssistantActive) {
//         console.log(`Repeating prompt: "${stepsConfig[stepIndex].prompt}"`);
//         speak(stepsConfig[stepIndex].prompt, language);
//         setTimeout(() => {
//           if (voiceAssistantActive && !profileData[field]?.trim()) {
//             console.log(`Starting listening again for field: ${field}`);
//             startListening(field, true);
//           }
//         }, 4000);
//       }
//     });
//   }, [setOnInputReceived, setOnPromptNeeded, language, voiceAssistantActive, profileData, speak, startListening]);

//   useEffect(() => {
//     return () => {
//       if (promptRepeatTimeout) {
//         clearTimeout(promptRepeatTimeout);
//       }
//     };
//   }, [promptRepeatTimeout]);

//   useEffect(() => {
//     if (promptRepeatTimeout) {
//       clearTimeout(promptRepeatTimeout);
//       setPromptRepeatTimeout(null);
//     }
//     setHasSpokenForNonFieldStep(false);
//     if (lastSpokenStep.current !== currentStep) {
//       setUserHasInteracted(false);
//     }
//     hasSpokenForCurrentStep.current = false;
//     lastSpokenStep.current = currentStep;
//     lastSpokenFieldValue.current = '';
//   }, [currentStep, promptRepeatTimeout]);

//   useEffect(() => {
//     if (!voiceAssistantActive && promptRepeatTimeout) {
//       clearTimeout(promptRepeatTimeout);
//       setPromptRepeatTimeout(null);
//     }
//   }, [voiceAssistantActive, promptRepeatTimeout]);

//   const enhancedHandleInputChange = (field, value) => {
//     console.log('enhancedHandleInputChange called:', field, value);
//     handleInputChange(field, value);
//     setUserHasInteracted(true);
//   };

//   const enhancedPrevStep = () => {
//     setUserHasInteracted(true);
//     prevStep();
//   };

//   const enhancedNextStep = () => {
//     setUserHasInteracted(true);
//     nextStep();
//   };

//   const enhancedHandlePhotoUpload = (e) => {
//     console.log('Photo upload clicked - setting user interaction to true');
//     setUserHasInteracted(true);
//     handlePhotoUpload(e);
//   };

//   const enhancedRemovePhoto = () => {
//     console.log('Remove photo clicked - setting user interaction to true');
//     setUserHasInteracted(true);
//     removePhoto();
//   };

//   const stepsConfig = [
//     {
//       title: "Profile Photo",
//       prompt: prompts[language][0],
//       component: (
//         <PhotoUpload
//           photoPreview={photoPreview}
//           handlePhotoUpload={enhancedHandlePhotoUpload}
//           removePhoto={enhancedRemovePhoto}
//         />
//       )
//     },
//     {
//       title: "Basic Information",
//       field: "name",
//       prompt: prompts[language][1],
//       component: (
//         <ProfileField
//           label="Name"
//           field="name"
//           placeholder="Enter your full name"
//           profileData={profileData}
//           handleInputChange={enhancedHandleInputChange}
//           voiceEnabled={voiceEnabled}
//           speechSupported={speechSupported}
//           isListening={isListening}
//           isProcessing={isProcessing}
//           startListening={() => {
//             setUserHasInteracted(true);
//             startListening('name');
//           }}
// //           stopListening={stopListening}
//         />
//       )
//     },
//     {
//       title: "Description",
//       field: "description",
//       prompt: prompts[language][2],
//       component: (
//         <ProfileField
//           label="Description"
//           field="description"
//           placeholder="Tell us about yourself"
//           type="textarea"
//           profileData={profileData}
//           handleInputChange={enhancedHandleInputChange}
//           voiceEnabled={voiceEnabled}
//           speechSupported={speechSupported}
//           isListening={isListening}
//           isProcessing={isProcessing}
//           startListening={() => {
//             setUserHasInteracted(true);
//             startListening('description');
//           }}
//           stopListening={stopListening}
//           detectedLanguage={profileData.detectedLanguage}
//           enhancedDescription={profileData.enhancedDescription}
//           geminiSuggestions={geminiSuggestions}
//           setProfileData={setProfileData}
//           triggerEnhancement={enhancementTrigger}
//           onEnhancementComplete={handleEnhancementComplete}
//         />
//       )
//     },
//     {
//       title: "Review",
//       prompt: prompts[language][3],
//       component: (
//         <div className="review-section">
//           <ProfilePreview
//             profileData={profileData}
//             photoPreview={photoPreview}
//           />
//         </div>
//       )
//     }
//   ];

//   useEffect(() => {
//     if (!voiceAssistantActive || isSpeaking) return; 
    
//     const currentStepData = stepsConfig[currentStep];
//     const currentField = currentStepData.field;
    
//     if (currentField) {
//       const fieldValue = profileData[currentField] || '';
//       const hasFieldValue = fieldValue.trim().length > 0;
      
//       if (!hasFieldValue && !isListening && !hasSpokenForCurrentStep.current) {
//         console.log(`Starting voice flow for field: ${currentField}`);
//         hasSpokenForCurrentStep.current = true;
        
//         speak(currentStepData.prompt, language);
        
//         setTimeout(() => {
//           if (voiceAssistantActive && !profileData[currentField]?.trim()) {
//             console.log(`Starting listening for field: ${currentField}`);
//             startListening(currentField);
//           }
//         }, 3000);
//       }
      
//       if (hasFieldValue && voiceAssistantActive && !isListening) {
//         console.log(`Field ${currentField} has value, moving to next step`);
//         setTimeout(() => nextStep(), 1500);
//       }
//     } 
//     else {
//       if (!hasSpokenForNonFieldStep && !userHasInteracted) {
//         console.log(`Speaking prompt for non-field step ${currentStep}`);
//         speak(currentStepData.prompt, language);
//         setHasSpokenForNonFieldStep(true);
        
//         const timeout = setTimeout(() => {
//           console.log(`Checking repeat conditions: voiceActive=${voiceAssistantActive}, userInteracted=${userHasInteracted}`);
//           if (voiceAssistantActive && !userHasInteracted) {
//             console.log('10 seconds passed and no user interaction - repeating prompt');
//             setHasSpokenForNonFieldStep(false);
//           } else {
//             console.log('User has interacted or voice disabled - not repeating prompt');
//           }
//         }, 10000);
        
//         setPromptRepeatTimeout(timeout);
//       }
      
//       if (userHasInteracted && promptRepeatTimeout) {
//         console.log('User interacted - clearing repeat timeout');
//         clearTimeout(promptRepeatTimeout);
//         setPromptRepeatTimeout(null);
//       }
//     }
//   }, [
//     currentStep, 
//     voiceAssistantActive, 
//     isSpeaking, 
//     isListening, 
//     hasSpokenForNonFieldStep, 
//     userHasInteracted,
//     language,
//     profileData.name,
//     profileData.description,
//     promptRepeatTimeout,
//     profileData,
//     speak,
//     startListening,
//     nextStep,
//     stepsConfig
//   ]);

//   const toggleVoiceAssistant = () => {
//     if (voiceAssistantActive) {
//       setVoiceAssistantActive(false);
//       stopListening();
//       if (promptRepeatTimeout) {
//         clearTimeout(promptRepeatTimeout);
//         setPromptRepeatTimeout(null);
//       }
//       hasSpokenForCurrentStep.current = false;
//       setHasSpokenForNonFieldStep(false);
//       setUserHasInteracted(false);
//       console.log('Voice assistant turned OFF');
//     }
//     else {
//       setVoiceAssistantActive(true);
//       hasSpokenForCurrentStep.current = false;
//       setHasSpokenForNonFieldStep(false);
//       setUserHasInteracted(false);
//       lastSpokenStep.current = currentStep;
//       lastSpokenFieldValue.current = '';
//       console.log('Voice assistant turned ON');
//     }
//   };

//   const handleSubmitProfile = async () => {
//     setUserHasInteracted(true);
    
//     const requiredFields = ['name', 'description'];
//     const missingFields = requiredFields.filter(field => !profileData[field]?.trim());
    
//     if (missingFields.length > 0) {
//       alert(`Please fill in the following required fields:\n• ${missingFields.join('\n• ')}`);
//       return;
//     }

//     try {
//       // Send name/description (and photo if already uploaded earlier) to backend
//       const formData = new FormData();
//       formData.append('name', profileData.name.trim());
//       formData.append('description', profileData.description.trim());
      
//       // Only append file if user selected one in this session
//       if (profileData.photo instanceof File) {
//         formData.append('profilePicture', profileData.photo);
//       }

//       const resp = await updateProfile(formData);
//       console.log('Profile updated response:', resp);
      
//       if (typeof onProfileComplete === 'function') {
//         onProfileComplete({ isProfileComplete: true });
//       }
      
//       alert('Profile saved successfully.');
//       navigate('/seller-dashboard');
//     } catch (error) {
//       console.error('Error submitting profile:', error);
//       const message = error?.response?.data?.message || 'Error saving profile. Please try again.';
//       alert(message);
//     }
//   };

//   return (
//     <div className="profile-container">
//       <div className="profile-card">
//         <div className="header">
//           <div className="profile-avatar">
//             {photoPreview ? (
//               <img src={photoPreview} alt="Profile" />
//             ) : (
//               <User size={32} className="text-white" />
//             )}
//           </div>
//           <h1 className="title">
//             AI-Powered Profile Setup
//             <Sparkles size={24} />
//           </h1>
//           <p className="subtitle">
//             Welcome Seller! • {speechSupported ? "Multi-language voice support active" : "Vision Analysis & Gemini Enhancement available"}
//           </p>
//           {user && (
//             <div className="user-info">
//               <p className="user-details">
//                 Phone: {user.phone} | Role: {user.role}
//               </p>
//             </div>
//           )}
//         </div>

//         {speechSupported && (
//           <div className="voice-assistant-controls">
//             <div className="language-selector">
//               <select 
//                 value={language} 
//                 onChange={(e) => {
//                   setLanguage(e.target.value);
//                   setRecognitionLanguage(e.target.value);
//                 }}
//                 className="language-dropdown"
// //               >
// //                 <option value="en-US">English</option>
// //                 <option value="hi-IN">Hindi</option>
// //               </select>
// //             </div>
// //             <button
// //               onClick={toggleVoiceAssistant}
// //               className={`btn-voice ${voiceAssistantActive ? 'active' : ''}`}
// //             >
// //               {voiceAssistantActive ? <MicOff size={20} /> : <Mic size={20} />}
// //               {voiceAssistantActive ? 'Turn Off Voice Assistant' : 'Start with Voice'}
// //             </button>
// //           </div>
// //         )}

// //         <ProgressBar
// //           currentStep={currentStep}
// //           totalSteps={stepsConfig.length}
// //         />

// //         <div className="step-content">
// //           <h2 className="step-title">
// //             {stepsConfig[currentStep].title}
// //           </h2>
// //           {stepsConfig[currentStep].component}
// //         </div>

        

// //         {currentStep < stepsConfig.length - 1 ? (
// //           <Navigation
// //             currentStep={currentStep}
// //             totalSteps={stepsConfig.length}
// //             prevStep={enhancedPrevStep}
// //             nextStep={enhancedNextStep}
// //             profileData={profileData}
// //             steps={stepsConfig}
// //             onTriggerEnhancement={handleTriggerEnhancement}
// //           />
// //         ) : (
// //           <div className="final-navigation">
// //             <button 
// //               onClick={enhancedPrevStep}
// //               className="btn btn-secondary"
// //             >
// //               Previous
// //             </button>
// //             <button 
// //               onClick={handleSubmitProfile}
// //               className="btn btn-primary"
// //               disabled={isProcessing}
// //             >
// //               <CheckCircle size={20} />
// //               {isProcessing ? 'Submitting...' : 'Submit Profile'}
// //             </button>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default ProfileSetup;









import React, { useState, useEffect, useRef } from 'react';
import { User, Sparkles, CheckCircle, Mic, MicOff } from 'lucide-react';
import { useProfileData } from '../../hooks/useProfileData';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { useTextToSpeech } from '../../hooks/useTextToSpeech';
import ProgressBar from './ProgressBar';
import PhotoUpload from './PhotoUpload';
import ProfileField from './ProfileField';
import Navigation from './Navigation';
import ProfilePreview from './ProfilePreview';
import BuyerDashboard from '../Buyer/BuyerDashboard';
import SellerDashboard from '../Seller/SellerDashboard'; 
import LoadingSpinner from '../common/LoadingSpinner';

import { getProfile, updateProfile } from '../../services/userServices';
import '../../styles/components/ProfileSetup.css';

const ProfileSetup = ({ user, onProfileComplete }) => {
  const {
    profileData,
    currentStep,
    photoPreview,
    isProcessing,
    geminiSuggestions,
    handleInputChange,
    handlePhotoUpload,
    removePhoto,
    nextStep,
    prevStep,
    setProfileData
  } = useProfileData();

  useEffect(() => {
    if (user && user.role === 'seller') {
      getProfile().then(profile => setProfileData(profile));
    } 
  }, [user, setProfileData]);

  const [voiceAssistantActive, setVoiceAssistantActive] = useState(false);
  const [language, setLanguage] = useState('en-US');
  const [promptRepeatTimeout, setPromptRepeatTimeout] = useState(null);
  const [hasSpokenForNonFieldStep, setHasSpokenForNonFieldStep] = useState(false);
  const [userHasInteracted, setUserHasInteracted] = useState(false);
  
  // Add enhancement trigger states
  const [enhancementTrigger, setEnhancementTrigger] = useState(false);
  const [enhancementCallback, setEnhancementCallback] = useState(null);
  
  const hasSpokenForCurrentStep = useRef(false);
  const lastSpokenStep = useRef(-1);
  const lastSpokenFieldValue = useRef('');

  const handleVoiceInput = async (field, value) => {
  try {
    await handleInputChange(field, value);
    setUserHasInteracted(true);
    // REMOVED: Automatic step advancement
    // User must manually click "Next" button
  } catch (error) {
    console.error('Error handling voice input:', error);
  }
};

  const {
    isListening,
    voiceEnabled,
    speechSupported,
    startListening,
    stopListening,
    setLanguage: setRecognitionLanguage,
    setOnInputReceived,
    setOnPromptNeeded,
  } = useSpeechRecognition(handleVoiceInput, profileData);

  const { isSpeaking, speak } = useTextToSpeech();

  // Function to trigger enhancement
  const handleTriggerEnhancement = (callback) => {
    setEnhancementCallback(() => callback);
    setEnhancementTrigger(true);
  };

  // Reset enhancement trigger
  const handleEnhancementComplete = () => {
    setEnhancementTrigger(false);
    if (enhancementCallback) {
      enhancementCallback();
      setEnhancementCallback(null);
    }
  };

  const prompts = {
    'en-US': [
      "Please upload a beautiful picture of yourself.",
      "Please say your name.",
      "Now, tell us a little bit about yourself.",
      "Please review your profile and submit when you're ready."
    ],
    'hi-IN': [
      "कृपया अपनी एक सुंदर तस्वीर अपलोड करें।",
      "कृपया अपना नाम बताएं।",
      "अब, हमें अपने बारे में कुछ बताएं।",
      "कृपया अपनी प्रोफ़ाइल की समीक्षा करें और जब आप तैयार हों तो सबमिट करें।"
    ]
  };

  useEffect(() => {
    setOnInputReceived((field, transcript) => {
      console.log(`Voice input received for ${field}: ${transcript}`);
      hasSpokenForCurrentStep.current = false;
      lastSpokenFieldValue.current = transcript;
      setUserHasInteracted(true);
    });

    setOnPromptNeeded((field) => {
      console.log(`Prompt repeat requested for field: ${field}`);
      const stepIndex = stepsConfig.findIndex(step => step.field === field);
      if (stepIndex !== -1 && voiceAssistantActive) {
        console.log(`Repeating prompt: "${stepsConfig[stepIndex].prompt}"`);
        speak(stepsConfig[stepIndex].prompt, language);
        setTimeout(() => {
          if (voiceAssistantActive && !profileData[field]?.trim()) {
            console.log(`Starting listening again for field: ${field}`);
            startListening(field, true);
          }
        }, 4000);
      }
    });
  }, [setOnInputReceived, setOnPromptNeeded, language, voiceAssistantActive, profileData, speak, startListening]);

  useEffect(() => {
    return () => {
      if (promptRepeatTimeout) {
        clearTimeout(promptRepeatTimeout);
      }
    };
  }, [promptRepeatTimeout]);

  useEffect(() => {
    if (promptRepeatTimeout) {
      clearTimeout(promptRepeatTimeout);
      setPromptRepeatTimeout(null);
    }
    setHasSpokenForNonFieldStep(false);
    if (lastSpokenStep.current !== currentStep) {
      setUserHasInteracted(false);
    }
    hasSpokenForCurrentStep.current = false;
    lastSpokenStep.current = currentStep;
    lastSpokenFieldValue.current = '';
  }, [currentStep, promptRepeatTimeout]);

  useEffect(() => {
    if (!voiceAssistantActive && promptRepeatTimeout) {
      clearTimeout(promptRepeatTimeout);
      setPromptRepeatTimeout(null);
    }
  }, [voiceAssistantActive, promptRepeatTimeout]);

  const enhancedHandleInputChange = (field, value) => {
    console.log('enhancedHandleInputChange called:', field, value);
    handleInputChange(field, value);
    setUserHasInteracted(true);
  };

  const enhancedPrevStep = () => {
    setUserHasInteracted(true);
    prevStep();
  };

  const enhancedNextStep = () => {
    setUserHasInteracted(true);
    nextStep();
  };

  const enhancedHandlePhotoUpload = (e) => {
    console.log('Photo upload clicked - setting user interaction to true');
    setUserHasInteracted(true);
    handlePhotoUpload(e);
  };

  const enhancedRemovePhoto = () => {
    console.log('Remove photo clicked - setting user interaction to true');
    setUserHasInteracted(true);
    removePhoto();
  };

  const stepsConfig = [
    {
      title: "Profile Photo",
      prompt: prompts[language][0],
      component: (
        <PhotoUpload
          photoPreview={photoPreview}
          handlePhotoUpload={enhancedHandlePhotoUpload}
          removePhoto={enhancedRemovePhoto}
        />
      )
    },
    {
      title: "Basic Information",
      field: "name",
      prompt: prompts[language][1],
      component: (
        <ProfileField
          label="Name"
          field="name"
          placeholder="Enter your full name"
          profileData={profileData}
          handleInputChange={enhancedHandleInputChange}
          voiceEnabled={voiceEnabled}
          speechSupported={speechSupported}
          isListening={isListening}
          isProcessing={isProcessing}
          startListening={() => {
            setUserHasInteracted(true);
            startListening('name');
          }}
          stopListening={stopListening}
        />
      )
    },
    {
      title: "Description",
      field: "description",
      prompt: prompts[language][2],
      component: (
        <ProfileField
          label="Description"
          field="description"
          placeholder="Tell us about yourself"
          type="textarea"
          profileData={profileData}
          handleInputChange={enhancedHandleInputChange}
          voiceEnabled={voiceEnabled}
          speechSupported={speechSupported}
          isListening={isListening}
          isProcessing={isProcessing}
          startListening={() => {
            setUserHasInteracted(true);
            startListening('description');
          }}
          stopListening={stopListening}
          detectedLanguage={profileData.detectedLanguage}
          enhancedDescription={profileData.enhancedDescription}
          geminiSuggestions={geminiSuggestions}
          setProfileData={setProfileData}
          triggerEnhancement={enhancementTrigger}
          onEnhancementComplete={handleEnhancementComplete}
        />
      )
    },
    {
      title: "Review",
      prompt: prompts[language][3],
      component: (
        <div className="review-section">
          <ProfilePreview
            profileData={profileData}
            photoPreview={photoPreview}
          />
        </div>
      )
    }
  ];

  useEffect(() => {
    if (!voiceAssistantActive || isSpeaking) return; 
    
    const currentStepData = stepsConfig[currentStep];
    const currentField = currentStepData.field;
    
    if (currentField) {
      const fieldValue = profileData[currentField] || '';
      const hasFieldValue = fieldValue.trim().length > 0;
      
      if (!hasFieldValue && !isListening && !hasSpokenForCurrentStep.current) {
        console.log(`Starting voice flow for field: ${currentField}`);
        hasSpokenForCurrentStep.current = true;
        
        speak(currentStepData.prompt, language);
        
        setTimeout(() => {
          if (voiceAssistantActive && !profileData[currentField]?.trim()) {
            console.log(`Starting listening for field: ${currentField}`);
            startListening(currentField);
          }
        }, 3000);
      }
      
      if (hasFieldValue && voiceAssistantActive && !isListening) {
        console.log(`Field ${currentField} has value, but not automatically moving to next step`);
      }
    } 
    else {
      if (!hasSpokenForNonFieldStep && !userHasInteracted) {
        console.log(`Speaking prompt for non-field step ${currentStep}`);
        speak(currentStepData.prompt, language);
        setHasSpokenForNonFieldStep(true);
        
        const timeout = setTimeout(() => {
          console.log(`Checking repeat conditions: voiceActive=${voiceAssistantActive}, userInteracted=${userHasInteracted}`);
          if (voiceAssistantActive && !userHasInteracted) {
            console.log('10 seconds passed and no user interaction - repeating prompt');
            setHasSpokenForNonFieldStep(false);
          } else {
            console.log('User has interacted or voice disabled - not repeating prompt');
          }
        }, 10000);
        
        setPromptRepeatTimeout(timeout);
      }
      
      if (userHasInteracted && promptRepeatTimeout) {
        console.log('User interacted - clearing repeat timeout');
        clearTimeout(promptRepeatTimeout);
        setPromptRepeatTimeout(null);
      }
    }
  }, [
    currentStep, 
    voiceAssistantActive, 
    isSpeaking, 
    isListening, 
    hasSpokenForNonFieldStep, 
    userHasInteracted,
    language,
    profileData.name,
    profileData.description,
    promptRepeatTimeout,
    profileData,
    speak,
    startListening,
    nextStep,
    stepsConfig
  ]);

  const toggleVoiceAssistant = () => {
    if (voiceAssistantActive) {
      setVoiceAssistantActive(false);
      stopListening();
      if (promptRepeatTimeout) {
        clearTimeout(promptRepeatTimeout);
        setPromptRepeatTimeout(null);
      }
      hasSpokenForCurrentStep.current = false;
      setHasSpokenForNonFieldStep(false);
      setUserHasInteracted(false);
      console.log('Voice assistant turned OFF');
    } else {
      setVoiceAssistantActive(true);
      hasSpokenForCurrentStep.current = false;
      setHasSpokenForNonFieldStep(false);
      setUserHasInteracted(false);
      lastSpokenStep.current = currentStep;
      lastSpokenFieldValue.current = '';
      console.log('Voice assistant turned ON');
    }
  };

  const handleSubmitProfile = async () => {
    setUserHasInteracted(true);
    
    const requiredFields = ['name', 'description'];
    const missingFields = requiredFields.filter(field => !profileData[field]?.trim());
    
    if (missingFields.length > 0) {
      alert(`Please fill in the following required fields:\n• ${missingFields.join('\n• ')}`);
      return;
    }

    try {
      // Send name/description (and photo if already uploaded earlier) to backend
      const formData = new FormData();
      formData.append('name', profileData.name.trim());
      formData.append('description', profileData.description.trim());
      
      // Only append file if user selected one in this session
      if (profileData.photo instanceof File) {
        formData.append('profilePicture', profileData.photo);
      }

      const resp = await updateProfile(formData);
      console.log('Profile updated response:', resp);
      
      if (typeof onProfileComplete === 'function') {
        onProfileComplete({ isProfileComplete: true });
      }
      
      alert('Profile saved successfully.');
    } catch (error) {
      console.error('Error submitting profile:', error);
      const message = error?.response?.data?.message || 'Error saving profile. Please try again.';
      alert(message);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="header">
          <div className="profile-avatar">
            {photoPreview ? (
              <img src={photoPreview} alt="Profile" />
            ) : (
              <User size={32} className="text-white" />
            )}
          </div>
          <h1 className="title">
            AI-Powered Profile Setup
            <Sparkles size={24} />
          </h1>
          <p className="subtitle">
            Welcome Seller! • {speechSupported ? "Multi-language voice support active" : "Vision Analysis & Gemini Enhancement available"}
          </p>
          {user && (
            <div className="user-info">
              <p className="user-details">
                Phone: {user.phone} | Role: {user.role}
              </p>
            </div>
          )}
        </div>

        {speechSupported && (
          <div className="voice-assistant-controls">
            <div className="language-selector">
              <select 
                value={language} 
                onChange={(e) => {
                  setLanguage(e.target.value);
                  setRecognitionLanguage(e.target.value);
                }}
                className="language-dropdown"
              >
                <option value="en-US">English</option>
                <option value="hi-IN">Hindi</option>
              </select>
            </div>
            <button
              onClick={toggleVoiceAssistant}
              className={`btn-voice ${voiceAssistantActive ? 'active' : ''}`}
            >
              {voiceAssistantActive ? <MicOff size={20} /> : <Mic size={20} />}
              {voiceAssistantActive ? 'Turn Off Voice Assistant' : 'Start with Voice'}
            </button>
          </div>
        )}

        <ProgressBar
          currentStep={currentStep}
          totalSteps={stepsConfig.length}
        />

        <div className="step-content">
          <h2 className="step-title">
            {stepsConfig[currentStep].title}
          </h2>
          {stepsConfig[currentStep].component}
        </div>

        {currentStep < stepsConfig.length - 1 ? (
          <Navigation
            currentStep={currentStep}
            totalSteps={stepsConfig.length}
            prevStep={enhancedPrevStep}
            nextStep={enhancedNextStep}
            profileData={profileData}
            steps={stepsConfig}
            onTriggerEnhancement={handleTriggerEnhancement}
          />
        ) : (
          <div className="final-navigation">
            <button 
              onClick={enhancedPrevStep}
              className="btn btn-secondary"
            >
              Previous
            </button>
            <button 
              onClick={handleSubmitProfile}
              className="btn btn-primary"
              disabled={isProcessing}
            >
              <CheckCircle size={20} />
              {isProcessing ? 'Submitting...' : 'Submit Profile'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSetup;