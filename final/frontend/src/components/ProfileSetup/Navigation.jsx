// // src/components/ProfileSetup/Navigation.jsx
// import React from 'react';
// import { ArrowRight, Save } from 'lucide-react';
// import { hasStepValidationErrors, validateRequiredFields } from '../../utils/validation';
// import '../../styles/components/Navigation.css';

// const Navigation = ({
//   currentStep,
//   totalSteps,
//   prevStep,
//   nextStep,
//   profileData,
//   steps
// }) => {
//   // Check if current step has validation errors
//   // Use explicit per-step checks to avoid cross-field interference
//   const currentStepHasErrors = (() => {
//     if (currentStep === 1) {
//       const name = (profileData.name || '').trim();
//       return name.length < 2;
//     }
//     if (currentStep === 2) {
//       const description = (profileData.description || '').trim();
//       return description.length < 10;
//     }
//     return hasStepValidationErrors(currentStep, profileData);
//   })();
  
//   // For final save, check if all required fields are valid
//   const allFieldsValid = () => {
//     const errors = validateRequiredFields(profileData);
//     return Object.keys(errors).length === 0;
//   };

//   const handleSave = () => {
//     // Validate all required fields before saving
//     if (!allFieldsValid()) {
//       alert('Please fill in all required fields:\n• Name\n• Description');
//       return;
//     }

//     const finalData = {
//       ...profileData,
//       timestamp: new Date().toISOString(),
//       aiProcessed: true,
//       googleCloudServices: {
//         languageDetection: !!profileData.detectedLanguage,
//         geminiEnhancement: !!profileData.enhancedDescription,
//         visionAnalysis: !!profileData.photoAnalysis
//       }
//     };
//     alert('🚀 Profile saved with Google Cloud AI!\n\n' + JSON.stringify(finalData, null, 2));
//   };

//   return (
//     <div className="navigation">
//       <button
//         onClick={prevStep}
//         disabled={currentStep === 0}
//         className="nav-btn"
//       >
//         Previous
//       </button>

//       <div className="step-indicators">
//         {Array.from({ length: totalSteps }, (_, index) => (
//           <div
//             key={index}
//             className={`step-dot ${index <= currentStep ? 'active' : ''}`}
//           />
//         ))}
//       </div>

//       {currentStep < totalSteps - 1 ? (
//         <button
//           onClick={nextStep}
//           disabled={currentStep === 1 ? false : currentStepHasErrors}
//           className="nav-btn"
//           title={(currentStep === 1 ? false : currentStepHasErrors) ? 'Please fill in the required field correctly' : 'Go to next step'}
//         >
//           <span>Next</span>
//           <ArrowRight size={16} />
//         </button>
//       ) : (
//         <button
//           onClick={handleSave}
//           disabled={!allFieldsValid()}
//           className="nav-btn"
//           title={!allFieldsValid() ? 'Please fill in all required fields' : 'Save your profile'}
//         >
//           <Save size={16} />
//           <span>Save AI-Enhanced Profile</span>
//         </button>
//       )}
//     </div>
//   );
// };

// export default Navigation;





// src/components/ProfileSetup/Navigation.jsx
import React, { useState } from 'react';
import { ArrowRight, Save, Loader2 } from 'lucide-react';
import { hasStepValidationErrors, validateRequiredFields } from '../../utils/validation';
import '../../styles/components/Navigation.css';

const Navigation = ({
  currentStep,
  totalSteps,
  prevStep,
  nextStep,
  profileData,
  steps,
  onTriggerEnhancement // New prop to trigger enhancement
}) => {
  const [isEnhancing, setIsEnhancing] = useState(false);

  // Check if current step has validation errors
  const currentStepHasErrors = (() => {
    if (currentStep === 1) {
      const name = (profileData.name || '').trim();
      return name.length < 2;
    }
    if (currentStep === 2) {
      const description = (profileData.description || '').trim();
      return description.length < 10;
    }
    return hasStepValidationErrors(currentStep, profileData);
  })();
  
  // For final save, check if all required fields are valid
  const allFieldsValid = () => {
    const errors = validateRequiredFields(profileData);
    return Object.keys(errors).length === 0;
  };

  const handleNextClick = async () => {
    // If we're on the description step (step 2), trigger enhancement first
    if (currentStep === 2) {
      const description = (profileData.description || '').trim();
      
      // Only enhance if there's enough content
      if (description.length >= 10) {
        setIsEnhancing(true);
        
        // Trigger enhancement and wait for completion
        if (onTriggerEnhancement) {
          await new Promise((resolve) => {
            onTriggerEnhancement(() => {
              setIsEnhancing(false);
              resolve();
            });
          });
        } else {
          // Fallback: just wait a bit if no enhancement function
          setTimeout(() => {
            setIsEnhancing(false);
          }, 1000);
        }
        nextStep(); // Move to next step only after enhancement
      } else {
        nextStep(); // Move to next step if no enhancement needed
      }
    } else {
      nextStep(); // Move to next step for other steps
    }
  };

  const handleSave = () => {
    // Validate all required fields before saving
    if (!allFieldsValid()) {
      alert('Please fill in all required fields:\n• Name\n• Description');
      return;
    }

    const finalData = {
      ...profileData,
      timestamp: new Date().toISOString(),
      aiProcessed: true,
      googleCloudServices: {
        languageDetection: !!profileData.detectedLanguage,
        geminiEnhancement: !!profileData.enhancedDescription,
        visionAnalysis: !!profileData.photoAnalysis
      }
    };
    alert('🚀 Profile saved with Google Cloud AI!\n\n' + JSON.stringify(finalData, null, 2));
  };

  return (
    <div className="navigation">
      <button
        onClick={prevStep}
        disabled={currentStep === 0}
        className="nav-btn"
      >
        Previous
      </button>

      <div className="step-indicators">
        {Array.from({ length: totalSteps }, (_, index) => (
          <div
            key={index}
            className={`step-dot ${index <= currentStep ? 'active' : ''}`}
          />
        ))}
      </div>

      {currentStep < totalSteps - 1 ? (
        <button
          onClick={handleNextClick}
          disabled={currentStep === 1 ? false : currentStepHasErrors || isEnhancing}
          className="nav-btn"
          title={
            isEnhancing 
              ? 'Enhancing description...' 
              : (currentStep === 1 ? false : currentStepHasErrors) 
              ? 'Please fill in the required field correctly' 
              : 'Go to next step'
          }
        >
          {isEnhancing ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Enhancing...</span>
            </>
          ) : (
            <>
              <span>Next</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      ) : (
        <button
          onClick={handleSave}
          disabled={!allFieldsValid()}
          className="nav-btn"
          title={!allFieldsValid() ? 'Please fill in all required fields' : 'Save your profile'}
        >
          <Save size={16} />
          <span>Save AI-Enhanced Profile</span>
        </button>
      )}
    </div>
  );
};

export default Navigation;