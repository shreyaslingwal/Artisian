// // src/components/ProfileSetup/ProfilePreview.jsx
// import React from 'react';
// import '../../styles/components/ProfilePreview.css';

// const ProfilePreview = ({ profileData, photoPreview }) => {
//   const hasData =
//     profileData.name || profileData.description || photoPreview;

//   if (!hasData) return null;

//   return (
//     <div className="preview-section">
//       <h3 className="preview-title">Profile Preview</h3>

//       <div className="preview-content">
//         {photoPreview && (
//           <img
//             src={photoPreview}
//             alt="Profile preview"
//             className="preview-avatar"
//           />
//         )}

//         <div className="preview-details">
//           {profileData.name && (
//             <div className="preview-item">
//               <span className="preview-label">Name:</span>
//               <span className="preview-value">{profileData.name}</span>
//             </div>
//           )}

//           {profileData.description && (
//             <div className="preview-item">
//               <span className="preview-label">Description:</span>
//               <span className="preview-value">{profileData.description}</span>
//             </div>
//           )}

//           {profileData.phone && (
//             <div className="preview-item">
//               <span className="preview-label">Phone:</span>
//               <span className="preview-value">{profileData.phone}</span>
//             </div>
//           )}

//           {profileData.detectedLanguage && (
//             <div className="preview-item">
//               <span className="preview-label">Language:</span>
//               <span className="preview-value">{profileData.detectedLanguage}</span>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* AI Enhancement Status */}
//       {(profileData.enhancedDescription || profileData.photoAnalysis || profileData.detectedLanguage) && (
//         <div className="ai-status">
//           <h4 className="ai-status-title">AI Enhancements Applied</h4>
//           <div className="ai-features">
//             {profileData.detectedLanguage && (
//               <span className="ai-feature">Language Detection</span>
//             )}
//             {profileData.enhancedDescription && (
//               <span className="ai-feature">Gemini Enhancement</span>
//             )}
//             {profileData.photoAnalysis && (
//               <span className="ai-feature">Vision Analysis</span>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProfilePreview;

// src/components/ProfileSetup/ProfilePreview.jsx
import React from 'react';
import '../../styles/components/ProfilePreview.css';

const ProfilePreview = ({ profileData, photoPreview }) => {
  const hasData =
    profileData.name || profileData.description || photoPreview;

  if (!hasData) return null;

  return (
    <div className="preview-section">
      <h3 className="preview-title">Profile Preview</h3>

      <div className="preview-content">
        {photoPreview && (
          <img
            src={photoPreview}
            alt="Profile preview"
            className="preview-avatar"
          />
        )}

        <div className="preview-details">
          {profileData.name && (
            <div className="preview-item">
              <span className="preview-label">Name:</span>
              <span className="preview-value">{profileData.name}</span>
            </div>
          )}

          {profileData.description && (
            <div className="preview-item">
              <span className="preview-label">Description:</span>
              <span className="preview-value">{profileData.description}</span>
            </div>
          )}

          {/* Phone number section removed */}

          {profileData.detectedLanguage && (
            <div className="preview-item">
              <span className="preview-label">Language:</span>
              <span className="preview-value">{profileData.detectedLanguage}</span>
            </div>
          )}
        </div>
      </div>

      {/* AI Enhancement Status */}
      {(profileData.enhancedDescription || profileData.photoAnalysis || profileData.detectedLanguage) && (
        <div className="ai-status">
          <h4 className="ai-status-title">AI Enhancements Applied</h4>
          <div className="ai-features">
            {profileData.detectedLanguage && (
              <span className="ai-feature">Language Detection</span>
            )}
            {profileData.enhancedDescription && (
              <span className="ai-feature">Gemini Enhancement</span>
            )}
            {profileData.photoAnalysis && (
              <span className="ai-feature">Vision Analysis</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePreview;