// // src/components/ProfileSetup/ProgressBar.jsx
// import React from 'react';
// import '../../styles/components/ProgressBar.css';

// const ProgressBar = ({ currentStep, totalSteps }) => {
//   // Calculate progress percentage
//   const progress = (currentStep / totalSteps) * 100;

//   return (
//     <div className="progress-section">
//       <div className="progress-header">
//         <span className="progress-text">
//           Step {currentStep + 1} of {totalSteps}
//         </span>
//         <span className="progress-text">
//           {Math.round(progress)}% Complete
//         </span>
//       </div>
//       <div className="progress-bar">
//         <div
//           className="progress-fill"
//           style={{ width: `${progress}%` }}
//         />
//       </div>
//     </div>
//   );
// };

// export default ProgressBar;





// src/components/ProfileSetup/ProgressBar.jsx
import React from 'react';
import '../../styles/components/ProgressBar.css';

const ProgressBar = ({ currentStep, totalSteps = 4 }) => {
  // Calculate progress percentage correctly
  // Assuming currentStep is 0-indexed (0, 1, 2, 3 for 4 steps)
  const progress = ((currentStep + 1) / totalSteps) * 100;
  
  return (
    <div className="progress-section">
      <div className="progress-header">
        <span className="progress-text">
          Step {currentStep + 1} of {totalSteps}
        </span>
        {/* <span className="progress-text">
          {Math.round(progress)}% Complete
        </span> */}
      </div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ 
            width: `${progress}%`,
            transition: 'width 0.5s ease'
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;